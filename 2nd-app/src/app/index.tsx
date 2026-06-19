import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "../../constants/Colors";
import { StatusBar } from "expo-status-bar";
import { FilterOptions, TASKS } from "../../constants/task";
import Header from "../../components/Header";
import DateSelector from "../../components/DateSelector";
import FilterTabs from "../../components/FilterTabs";
import TaskCard from "../../components/TaskCards";

const Index = () => {
  const insets = useSafeAreaInsets();
  const [activeFilter,setActiveFilter] =useState<FilterOptions >("All")
  return (
    <View style={[{ paddingTop: insets.top }, styles.container]}>
      <StatusBar style="light" />
      <FlatList
        data={TASKS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TaskCard task={item}/>}
        ListHeaderComponent={
          <>
            {/* Header */}
            <Header />
            {/* Date Selecotr */}
            <DateSelector />
            {/* Filters Tabs */}
            <FilterTabs selected={activeFilter} onSelect={setActiveFilter }  />
          </>
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    paddingBottom: 24,
  },
});
