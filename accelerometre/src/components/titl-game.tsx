import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useFrameCallback,
  runOnJS,
} from "react-native-reanimated";
import { useAccelerometer } from "@/hooks/use-accelerometer";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const PLAY_WIDTH = SCREEN_WIDTH - 40;
const PLAY_HEIGHT = 520;
const CANVAS_SIZE = 4000;
const CANVAS_CENTER = CANVAS_SIZE / 2;

interface PathPoint {
  x: number;
  y: number;
}

export function TiltGame() {
  const { x: ax, y: ay, z: az, available } = useAccelerometer();
  const { top, bottom } = useSafeAreaInsets();

  // Mode: 0 = 2D Trajectory Tracer (Free Roam), 1 = Wave Oscilloscope (ECG/Sin-Cos)
  const [activeMode, setActiveMode] = useState<0 | 1>(0);
  const [autoCenter, setAutoCenter] = useState(true);
  const [path, setPath] = useState<PathPoint[]>([]);

  // Telemetry state
  const [telemetry, setTelemetry] = useState({
    rawX: 0,
    rawY: 0,
    rawZ: 0,
    calX: 0,
    calY: 0,
    speed: 0,
    px: CANVAS_CENTER,
    py: CANVAS_CENTER,
  });

  // Reanimated shared values for accelerometer inputs
  const accelX = useSharedValue(0);
  const accelY = useSharedValue(0);
  const accelZ = useSharedValue(0);

  // Calibration settings
  const calX = useSharedValue(0);
  const calY = useSharedValue(-1.0); // Default vertical tilt value

  // Mode shared value for frame callback
  const mode = useSharedValue<0 | 1>(0);
  useEffect(() => {
    mode.value = activeMode;
    clearPath();
  }, [activeMode]);

  // Player positions and velocity on the 2000x2000 canvas
  const playerX = useSharedValue(CANVAS_CENTER);
  const playerY = useSharedValue(CANVAS_CENTER);
  const playerVX = useSharedValue(0);
  const playerVY = useSharedValue(0);

  // Path drawing history variables
  const lastX = useSharedValue(CANVAS_CENTER);
  const lastY = useSharedValue(CANVAS_CENTER);

  // ScrollView references for auto-scrolling
  const horizScrollRef = useRef<ScrollView>(null);
  const vertScrollRef = useRef<ScrollView>(null);

  // Sync accelerometer inputs
  useEffect(() => {
    accelX.value = ax;
    accelY.value = ay;
    accelZ.value = az;
  }, [ax, ay, az]);

  // Calibrate current orientation as neutral center
  const calibrateNeutral = () => {
    calX.value = ax;
    calY.value = ay;
  };

  // Clear path drawings
  const clearPath = () => {
    setPath([]);
    const startX = activeMode === 0 ? CANVAS_CENTER : 0;
    const startY = CANVAS_CENTER;
    playerX.value = startX;
    playerY.value = startY;
    playerVX.value = 0;
    playerVY.value = 0;
    lastX.value = startX;
    lastY.value = startY;
  };

  // Append new coordinate point to path trace (called from UI thread)
  const appendPathPoint = (x: number, y: number) => {
    setPath((prev) => {
      const next = [...prev, { x, y }];
      // Keep length capped at 250 points to prevent slowdowns
      if (next.length > 250) {
        next.shift();
      }
      return next;
    });
  };

  // Scroll Viewport to focus on the active tracer coordinate
  const scrollCanvas = (x: number, y: number) => {
    if (autoCenter) {
      horizScrollRef.current?.scrollTo({
        x: x - PLAY_WIDTH / 2,
        animated: true,
      });
      vertScrollRef.current?.scrollTo({
        y: y - PLAY_HEIGHT / 2,
        animated: true,
      });
    }
  };

  // 60 FPS update loop
  useFrameCallback((frameInfo) => {
    if (!frameInfo.timeSincePreviousFrame) return;
    const dt = Math.min(frameInfo.timeSincePreviousFrame / 1000, 0.03);

    const isWaveMode = mode.value === 1;

    // Calibrated tilt inputs
    const tx = accelX.value - calX.value;
    const ty = accelY.value - calY.value;

    let px = playerX.value;
    let py = playerY.value;
    let vx = playerVX.value;
    let vy = playerVY.value;

    if (isWaveMode) {
      // WAVE MODE:
      // X moves horizontally at constant speed
      const waveSpeed = 160; // horizontal speed (px/sec)
      px += waveSpeed * dt;

      // Wrap around canvas limits
      if (px > CANVAS_SIZE) {
        px = 0;
        runOnJS(setPath)([]);
      }

      // Y is driven directly by vertical accelerometer tilt (smoothed low-pass filter)
      const targetY = CANVAS_CENTER + ty * 350; // map tilt to Y displacement
      py = py + (targetY - py) * 0.15; // smooth damping filter

      vx = waveSpeed;
      vy = 0;
    } else {
      // TRACER MODE:
      // X and Y controlled by tilt gravity forces
      const SENSITIVITY = 1200;
      const FRICTION = 3.2;

      const ax_physics = -tx * SENSITIVITY;
      const ay_physics = -ty * SENSITIVITY;

      vx = (vx + ax_physics * dt) * (1 - FRICTION * dt);
      vy = (vy + ay_physics * dt) * (1 - FRICTION * dt);

      px += vx * dt;
      py += vy * dt;

      // Restrict boundaries
      if (px < 15) {
        px = 15;
        vx = 0;
      }
      if (px > CANVAS_SIZE - 15) {
        px = CANVAS_SIZE - 15;
        vx = 0;
      }
      if (py < 15) {
        py = 15;
        vy = 0;
      }
      if (py > CANVAS_SIZE - 15) {
        py = CANVAS_SIZE - 15;
        vy = 0;
      }
    }

    playerX.value = px;
    playerY.value = py;
    playerVX.value = vx;
    playerVY.value = vy;

    // Track movement distance to append trail dots (avoid duplicate overlapping points)
    const dx = px - lastX.value;
    const dy = py - lastY.value;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 8) {
      lastX.value = px;
      lastY.value = py;
      runOnJS(appendPathPoint)(px, py);
    }

    // Dispatch telemetry and trigger camera auto-scroll
    runOnJS(setTelemetry)({
      rawX: Math.round(accelX.value * 100) / 100,
      rawY: Math.round(accelY.value * 100) / 100,
      rawZ: Math.round(accelZ.value * 100) / 100,
      calX: Math.round(calX.value * 100) / 100,
      calY: Math.round(calY.value * 100) / 100,
      speed: Math.round(Math.sqrt(vx * vx + vy * vy)),
      px: Math.round(px),
      py: Math.round(py),
    });

    runOnJS(scrollCanvas)(px, py);
  });

  // Reanimated style for active glowing tracer dot
  const tracerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: playerX.value - 6 },
        { translateY: playerY.value - 6 },
      ],
    };
  });

  // Simulator steer helper button actions
  const simulateSteer = (dir: "left" | "right" | "up" | "down" | "release") => {
    if (dir === "left") {
      accelX.value = 0.45;
    } else if (dir === "right") {
      accelX.value = -0.45;
    } else if (dir === "up") {
      accelY.value = -0.6;
    } else if (dir === "down") {
      accelY.value = -1.4;
    } else {
      accelX.value = 0;
      accelY.value = -1.0;
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: top + 15, paddingBottom: bottom + 15 },
      ]}
    >
      {/* Top Telemetry Data Card */}
      <View style={styles.topCard}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>ACCELEROMETER TELEMETRY</Text>
          <View style={styles.linkStatus}>
            <View
              style={[
                styles.indicatorDot,
                { backgroundColor: available ? "#00f0ff" : "#ff0055" },
              ]}
            />
            <Text style={styles.indicatorText}>
              {available ? "SENSOR: LIVE" : "SENSOR: OFFLINE"}
            </Text>
          </View>
        </View>

        {/* X, Y, Z Live Values Display */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>X-AXIS (TILT L/R)</Text>
            <Text style={styles.metricValue}>{telemetry.rawX.toFixed(2)}G</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Y-AXIS (TILT F/B)</Text>
            <Text style={styles.metricValue}>{telemetry.rawY.toFixed(2)}G</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Z-AXIS (DEPTH)</Text>
            <Text style={styles.metricValue}>{telemetry.rawZ.toFixed(2)}G</Text>
          </View>
        </View>

        {/* Mode controls & calibration bar */}
        <View style={styles.controlsBar}>
          <TouchableOpacity
            onPress={() => setActiveMode(0)}
            style={[styles.modeBtn, activeMode === 0 && styles.activeModeBtn]}
          >
            <Text
              style={[
                styles.modeBtnText,
                activeMode === 0 && styles.activeModeText,
              ]}
            >
              2D TRACER
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveMode(1)}
            style={[styles.modeBtn, activeMode === 1 && styles.activeModeBtn]}
          >
            <Text
              style={[
                styles.modeBtnText,
                activeMode === 1 && styles.activeModeText,
              ]}
            >
              WAVE GRAPH
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={calibrateNeutral}
            style={styles.utilityBtn}
          >
            <Text style={styles.utilityBtnText}>CALIBRATE</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={clearPath} style={styles.utilityBtn}>
            <Text style={styles.utilityBtnText}>CLEAR</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSubRow}>
          <Text style={styles.calText}>
            Calibrated Neutral: {telemetry.calX.toFixed(1)}X,{" "}
            {telemetry.calY.toFixed(1)}Y
          </Text>
          <TouchableOpacity
            onPress={() => setAutoCenter(!autoCenter)}
            style={[styles.toggleBtn, autoCenter && styles.toggleBtnActive]}
          >
            <Text style={styles.toggleBtnText}>
              {autoCenter ? "CAMERA: AUTO-LOCK" : "CAMERA: MANUAL PAN"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Visualization Card */}
      <View style={styles.canvasCard}>
        <Text style={styles.canvasLabel}>
          {activeMode === 0
            ? "// Trajectory Tracer Canvas (2000x2000)"
            : "// Oscilloscope Scrolling Wave Canvas"}
        </Text>

        <View style={styles.viewport}>
          {/* Scrollable Container (allows manual swipe in manual camera mode) */}
          <ScrollView
            ref={vertScrollRef}
            scrollEnabled={!autoCenter}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.vertScrollContent}
          >
            <ScrollView
              ref={horizScrollRef}
              horizontal
              scrollEnabled={!autoCenter}
              showsHorizontalScrollIndicator={false}
            >
              {/* Canvas Board Grid Area */}
              <View style={styles.canvas}>
                {/* Horizontal Grid Lines */}
                {Array.from({ length: 21 }).map((_, i) => (
                  <View
                    key={`h-${i}`}
                    style={[styles.gridLineH, { top: i * 100 }]}
                  />
                ))}
                {/* Vertical Grid Lines */}
                {Array.from({ length: 21 }).map((_, i) => (
                  <View
                    key={`v-${i}`}
                    style={[styles.gridLineV, { left: i * 100 }]}
                  />
                ))}

                {/* Drawn Path Trail */}
                {path.map((pt, idx) => (
                  <View
                    key={`dot-${idx}`}
                    style={[
                      styles.pathDot,
                      {
                        left: pt.x - 3,
                        top: pt.y - 3,
                      },
                    ]}
                  />
                ))}

                {/* Animated active tracer dot */}
                <Animated.View style={[styles.tracer, tracerStyle]} />
              </View>
            </ScrollView>
          </ScrollView>
        </View>
      </View>

      {/* Manual Simulator Steering D-Pad (only shows on simulators) */}
      {!available && (
        <View style={styles.dpadCard}>
          <Text style={styles.dpadLabel}>// SIMULATION DIRECTION PANEL</Text>
          <View style={styles.dpadLayout}>
            <View style={styles.dpadRowCentered}>
              <TouchableOpacity
                onPressIn={() => simulateSteer("up")}
                onPressOut={() => simulateSteer("release")}
                style={styles.dpadBtn}
              >
                <Text style={styles.dpadBtnText}>▲ UP</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.dpadRow}>
              <TouchableOpacity
                onPressIn={() => simulateSteer("left")}
                onPressOut={() => simulateSteer("release")}
                style={styles.dpadBtn}
              >
                <Text style={styles.dpadBtnText}>◀ L</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPressIn={() => simulateSteer("down")}
                onPressOut={() => simulateSteer("release")}
                style={styles.dpadBtn}
              >
                <Text style={styles.dpadBtnText}>▼ DOWN</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPressIn={() => simulateSteer("right")}
                onPressOut={() => simulateSteer("release")}
                style={styles.dpadBtn}
              >
                <Text style={styles.dpadBtnText}>R ▶</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingHorizontal: 20,
    // justifyContent: "space-between",
    gap: 40,
  },
  topCard: {
    borderWidth: 1.5,
    borderColor: "#00f0ff33",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#000000",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#00f0ff22",
    paddingBottom: 8,
  },
  headerTitle: {
    color: "#00f0ff",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.2,
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
  },
  linkStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  indicatorText: {
    color: "#ffffff",
    fontSize: 8,
    fontWeight: "bold",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  metricsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 14,
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    color: "#00f0ff66",
    fontSize: 8,
    fontWeight: "bold",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  metricValue: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 2,
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
  },
  controlsBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  modeBtn: {
    flex: 1.2,
    height: 28,
    borderWidth: 1,
    borderColor: "#00f0ff33",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },
  activeModeBtn: {
    borderColor: "#00f0ff",
    backgroundColor: "rgba(0, 240, 255, 0.08)",
  },
  modeBtnText: {
    color: "#00f0ff66",
    fontSize: 8,
    fontWeight: "bold",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  activeModeText: {
    color: "#00f0ff",
  },
  utilityBtn: {
    flex: 1,
    height: 28,
    borderWidth: 1,
    borderColor: "#00f0ff33",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
  utilityBtnText: {
    color: "#00f0ffaa",
    fontSize: 8,
    fontWeight: "bold",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  settingsSubRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#00f0ff11",
  },
  calText: {
    color: "#888",
    fontSize: 8,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  toggleBtn: {
    height: 22,
    borderWidth: 1,
    borderColor: "#00f0ff33",
    borderRadius: 4,
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleBtnActive: {
    borderColor: "#00f0ff",
  },
  toggleBtnText: {
    color: "#00f0ffcc",
    fontSize: 8,
    fontWeight: "bold",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  canvasCard: {
    borderWidth: 1.5,
    borderColor: "#00f0ff33",
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#000000",
    height: PLAY_HEIGHT + 35,
  },
  canvasLabel: {
    color: "#00f0ff88",
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 0.5,
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    marginBottom: 8,
  },
  viewport: {
    height: PLAY_HEIGHT,
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#00f0ff22",
    backgroundColor: "#000000",
  },
  vertScrollContent: {
    height: CANVAS_SIZE,
  },
  canvas: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    position: "relative",
    backgroundColor: "#000000",
  },
  gridLineH: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(0, 240, 255, 0.05)",
  },
  gridLineV: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "rgba(0, 240, 255, 0.05)",
  },
  pathDot: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#00f0ffcc",
    shadowColor: "#00f0ff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  },
  tracer: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#00f0ff",
    shadowColor: "#00f0ff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 5,
  },
  dpadCard: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 10,
    padding: 10,
  },
  dpadLabel: {
    color: "#555",
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    marginBottom: 8,
  },
  dpadLayout: {
    alignItems: "center",
  },
  dpadRowCentered: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 4,
  },
  dpadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 160,
  },
  dpadBtn: {
    width: 46,
    height: 28,
    borderWidth: 1,
    borderColor: "#00f0ff22",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.01)",
  },
  dpadBtnText: {
    color: "#00f0ff88",
    fontSize: 8,
    fontWeight: "bold",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
});
