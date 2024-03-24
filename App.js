import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, TextInput, View, Switch } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';

const Stack = createNativeStackNavigator();

export default function App() {

  useEffect(

    () => {

      const db = SQLite.openDatabase('phasic.db');

      db.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS exercise (exerciseID INTEGER PRIMARY KEY AUTOINCREMENT, exerciseName TEXT'
        );
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS exerciseSet (setID INTEGER PRIMARY KEY AUTOINCREMENT, exerciseID TEXT, reps INTEGER, weight REAL, duration REAL, FOREIGN KEY exerciseID REFERENCES exercise(exerciseID)'
        );
      });
    }
  );

  // const insertSetIntoDB = (name, reps) => {
  //   db.transaction(tx => {
  //     tx.executeSql(
  //       'INSERT INTO exerciseSet (name, reps) VALUES (?, ?)', [name, reps],
  //       (_, result) => {
  //         console.log('Rows affected:', result.rowsAffected);
  //       },
  //       (_, error) => {
  //         console.log('Error inserting data:', error);
  //       }
  //     );
  //   });
  // };

  // const displayExercisesData = (name) => {
  //   db.transaction(tx => {
  //     tx.executeSql(
  //       'SELECT * FROM exerciseSet WHERE name = "?"',
  //       [name],
  //       (_, { rows }) => {
  //         const data = rows._array;
  //         console.log(data);
  //       },
  //       (_, error) => {
  //         console.log('Error displaying result:', error);
  //       }
  //     );
  //   });
  // };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
        />
        <Stack.Screen name="Record" component={Record} />
        <Stack.Screen name="Display" component={Display} />
        <Stack.Screen name="Contact" component={Contact} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const Home = ({ navigation }) => {

  handleRecordPress = () => {
    navigation.navigate('Record')
  }

  handleDisplayPress = () => {
    navigation.navigate('Display')
  }

  handleContactPress = () => {
    navigation.navigate('Contact')
  }

  return (
    <View style={styles.container}>
      <View>
        <Text>Phasic Logo</Text>
      </View>
      <View>
        <Pressable onPress={handleDisplayPress}>
          <Text>Display My Work</Text>
        </Pressable>
      </View>
      <View>
        <Text>Don't Be Basic, Be Phasic</Text>
        <Text>
          Grow phasic, cycle by cycle using our app to record your workouts and track your progress. Focus and log progress
          on factors such as absolute strength, relative strength, cardiovascular endurance and work capacity,
          using our smooth interface to efficiently input your work sets mid -or post- workout. Share your numbers with your
          coach, clients, teammates or friends for feedback, accountability and motivation, and watch your performance
          climb step-by-step, phase by phase.
        </Text>
      </View>
      <View>
        <Pressable onPress={handleRecordPress}>
          <Text>Record Workout</Text>
        </Pressable>
      </View>
      <View>
        <Pressable onPress={handleContactPress}>
          <Text>Contact</Text>
        </Pressable>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const isExerciseNameValid = (name) => {
  if(name.trim() == ''){
    console.log('Empty exerciseName')
    return false
  };
  if(name.length > 50){
    console.log('exerciseName above 50 chars')
    return false
  };
  if((/[^a-z0-9\s]/gi).test(name)){
    console.log('Attempted to add forbidden chars')
    return false
  };
  return true
};

const isExerciseDistanceValid = (distance) => {
  if(!/^(\d+(\.\d+)?|\.\d+)$/.test(distance)){
    console.log("distance input is not valid, positive number")
    return false
  };
  return true 
};

const isExerciseDurationValid = (name) => {
  if(!/^(\d+(\.\d+)?|\.\d+)$/.test(distance)){
    console.log("Duration input is not valid, positive number")
    return false
  };
  return true
};

const isExerciseRepsValid = (reps) => {
  if(!/^[1-9]\d*$/.test(reps)){
    console.log("reps input is not valid, whole, positive number")
    return false
  };
  return true
}

const isExerciseLoadValid = (load) => {
  if(!/^(\d+(\.\d+)?|\.\d+)$/.test(load) && load.trim() !== "0"){
    console.log("Load input is not valid, non-negative number")
    return false
  };
  return true
};

const ExerciseForTime = () => {
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseDistance, setExerciseDistance] = useState('')
  const [exerciseDuration, setExerciseDuration] = useState('');
  
  const handleAddForTimeSet = () => {
    if (isExerciseNameValid(exerciseName) && isExerciseDistanceValid(exerciseDistance) && isExerciseDurationValid(exerciseDuration)) {
      console.log('Added set')
    }
  }

  return (
    <View>
      <TextInput onChangeText={setExerciseName} value={exerciseName} placeholder='exercise name' />
      <TextInput onChangeText={setExerciseDistance} value={exerciseDistance} placeholder='distance' keyboardType='numeric' />
      <TextInput onChangeText={setExerciseDuration} value={exerciseDuration} placeholder='duration' keyboardType='numeric' />
      <Pressable onPress={handleAddForTimeSet}>
        <Text>Add Set</Text>
      </Pressable>
    </View>
  )
}

const ExerciseForReps = () => {
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseReps, setExerciseReps] = useState('');
  const [exerciseLoad, setExerciseLoad] = useState('');

  const handleAddForRepsSet = () => {
    if (isExerciseNameValid(exerciseName) && isExerciseRepsValid(exerciseReps) && isExerciseLoadValid(exerciseLoad)) {
      console.log('Added set')
    }
  }

  return (
    <View>
      <TextInput onChangeText={setExerciseName} value={exerciseName} placeholder='exercise name' />
      <TextInput onChangeText={setExerciseReps} value={exerciseReps} placeholder='reps' keyboardType='numeric' />
      <TextInput onChangeText={setExerciseLoad} value={exerciseLoad} placeholder='kg' keyboardType='numeric' />
      <Pressable onPress={handleAddForRepsSet}>
        <Text>Add Set</Text>
      </Pressable>
    </View>
  )
}


const Record = () => {

  const [isReps, setIsReps] = useState(true);
  const toggleIsReps = () => setIsReps(previousState => !previousState);

  return (
    <View>
      <Text>reps</Text>
      <Switch
        trackColor={{ false: 'grey', true: 'grey' }}
        thumbColor={isReps ? 'black' : 'black'}
        onValueChange={toggleIsReps}
        value={isReps}
      />
      <Text>time</Text>
      {isReps && <ExerciseForReps />}
      {!isReps && <ExerciseForTime />}
    </View>
  )
}

const Display = () => {
  return (
    <View>
      <Text>
        Display Screen
      </Text>
    </View>
  )
}

const Contact = () => {
  return (
    <View>
      <Text>
        Contact Screen
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
