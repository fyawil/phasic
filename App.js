import { StatusBar } from 'expo-status-bar';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';

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

  const handlePressSubmitSet = async () => {
    console.log(exerciseName)
  }

  return (
    <>
      <TextInput value={exerciseName} onChangeText={setExerciseName} />
      <TextInput value={exerciseReps} onChangeText={setExerciseReps}/>
      <TextInput value={exerciseWeight} onChangeText={setExerciseWeight}/>
      <TextInput value={exerciseDuration} onChangeText={setExerciseDuration}/>
      <TextInput value={exerciseDistance} onChangeText={setExerciseDistance}/>
      <Pressable onPress={handlePressSubmitSet}>
        <Text>Submit Set</Text>
      </Pressable>
    </>
  );
};

const StatPage = () => {
  return <Text>Stat Page</Text>;
};

const NavigationBar = ({ setIsStatPageShown }) => {
  const handlePressInputPage = () => setIsStatPageShown(false);
  const handlePressStatPage = () => setIsStatPageShown(true);

  return (
    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
      <Pressable onPress={handlePressInputPage}>
        <Text>Input Page</Text>
      </Pressable>
      <Pressable onPress={handlePressStatPage}>
        <Text>Stat Page</Text>
      </Pressable>
    </View>
  );
};
