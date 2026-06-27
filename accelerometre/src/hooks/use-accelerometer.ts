 import { useEffect, useState } from "react";
 import { Accelerometer } from 'expo-sensors';
 
 export function useAccelerometer(){
    const [available,setavailable] = useState<boolean | null>(null);
    const [x,setX] = useState(0);
    const [y,setY] = useState(0);
    const [z,setZ] = useState(0);

    useEffect(() => {
        Accelerometer.isAvailableAsync().then(setavailable);
    }, []);
    
    useEffect(() => { 
        let subscription  : {remove : ()=>void} | undefined;
        (async ()=>{ 
          const isavailable = await Accelerometer.isAvailableAsync();
          setavailable(isavailable);
          if(!isavailable) return ;

          Accelerometer.setUpdateInterval(20)     // 20ms (50Hz) for smooth movement

          subscription = Accelerometer.addListener((data)=>{
            setX(data.x)
            setY(data.y)
            setZ(data.z)  
          })

        })() 
   
        return () => subscription?.remove();
    }, []); 
    
    return  { x, y, z, available };

 }
  