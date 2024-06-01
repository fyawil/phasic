import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Pressable, Text, TextInput, View } from 'react-native';
import { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import { Dropdown } from 'react-native-element-dropdown';

export default function App() {
  // State variable indicating whether display page or input page is shown
  const [isStatPageShown, setIsStatPageShown] = useState(false);

  // Creates the database tables
  useEffect(() => {
    const initDb = async () => {
      const db = await SQLite.openDatabaseAsync('phasic_log');
      await db.execAsync(`
      CREATE TABLE IF NOT EXISTS exercise (
        exerciseID INTEGER PRIMARY KEY AUTOINCREMENT, 
        exerciseName TEXT
        ); 
      CREATE TABLE IF NOT EXISTS exerciseSet (
        setID INTEGER PRIMARY KEY AUTOINCREMENT, 
        exerciseID INTEGER, 
        exerciseReps INTEGER, 
        exerciseWeight REAL, 
        exerciseDuration REAL, 
        exerciseDistance REAL, 
        FOREIGN KEY (exerciseID) REFERENCES exercise(exerciseID)
        );
      `);
    };
    initDb();
  }, []);

  return (
    <View>
      {/* Blacks out the system status bar and makes the app screen start where it ends */}
      <StatusBar hidden />

      {/* Allows user to toggle between recording workouts and displaying stats of workouts */}
      <NavigationBar setIsStatPageShown={setIsStatPageShown} />

      {/* Displays the input page is the stat page is not shown and vice versa */}
      <View>
        {!isStatPageShown && <InputPage />}
        {isStatPageShown && <StatPage />}
      </View>

    </View>
  );
}

const InputPage = () => {

  // State variables tracking the inputs of the user when recording their workout set
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseReps, setExerciseReps] = useState('');
  const [exerciseWeight, setExerciseWeight] = useState('');
  const [exerciseDuration, setExerciseDuration] = useState('');
  const [exerciseDistance, setExerciseDistance] = useState('');

  // Inserts workout set details into the database
  const handlePressSubmitSet = async () => {
    // Opens the database
    db = await SQLite.openDatabaseAsync('phasic_log');
    // Adds exercise to exercise table if it does not exist in it already
    const res = await db.getAllAsync('SELECT exerciseName FROM exercise');
    const exercisesInDB = res.map(ex => ex.exerciseName);
    if(exercisesInDB.indexOf(exerciseName) == -1){
          await db.runAsync('INSERT INTO exercise (exerciseName) VALUES (?)', exerciseName);
    }
    // Adds set details to the exerciseSet table
    const exerciseID = await db.getFirstAsync(` SELECT exerciseID FROM exercise WHERE exerciseName = ?`, exerciseName);
    await db.runAsync('INSERT INTO exerciseSet (exerciseID, exerciseReps, exerciseWeight, exerciseDuration, exerciseDistance) VALUES (?, ?, ?, ?, ?)', exerciseID['exerciseID'], exerciseReps, exerciseWeight, exerciseDuration, exerciseDistance);
  }

  return (
    <>
      {/* Input fields for the set details */}
      <TextInput value={exerciseName} onChangeText={setExerciseName} />
      <TextInput value={exerciseReps} onChangeText={setExerciseReps}/>
      <TextInput value={exerciseWeight} onChangeText={setExerciseWeight}/>
      <TextInput value={exerciseDuration} onChangeText={setExerciseDuration}/>
      <TextInput value={exerciseDistance} onChangeText={setExerciseDistance}/>
      {/* Submits the set to the db if pressed */}
      <Pressable onPress={handlePressSubmitSet}>
        <Text>Submit Set</Text>
      </Pressable>
    </>
  );
};

const StatPage = () => {

  const [displayedExercise, setDisplayedExercise] = useState(null)
  const [data, setData] = useState([]);

  useEffect(() => {
    const extractExerciseNamesFromDB = async () => {
    // Opens the database
    db = await SQLite.openDatabaseAsync('phasic_log');
    // Adds exercise to exercise table if it does not exist in it already
    const res = await db.getAllAsync('SELECT exerciseName FROM exercise');
    setData(res.map(ex => ({label: ex.exerciseName, value: ex.exerciseName})));
    }
    extractExerciseNamesFromDB()
  })
  return (
    <View>
      <Dropdown
        data={data}
        labelField="label"
        valueField="value"
        onChange={item => {
          setDisplayedExercise(item.value);
        }}
      />
      <Text>{displayedExercise}</Text>
    </View>
  )
};

const NavigationBar = ({ setIsStatPageShown }) => {
  const handlePressInputPage = () => setIsStatPageShown(false);
  const handlePressStatPage = () => setIsStatPageShown(true);

  return (
    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
      {/* Switches screen to input page if pressed */}
      <Pressable onPress={handlePressInputPage}>
        <Text>Input Page</Text>
      </Pressable>
      {/* Switches screen to stat page if pressed */}
      <Pressable onPress={handlePressStatPage}>
        <Text>Stat Page</Text>
      </Pressable>
    </View>
  );
};
