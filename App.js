import { StatusBar } from 'expo-status-bar';
import { Pressable, Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import { InputPage } from './InputPage';
import { StatPage } from './StatPage';

export default function App() {
  // State variable indicating whether display page or input page is shown
  const [isStatPageShown, setIsStatPageShown] = useState(false);

  // Creates the database tables
  useEffect(() => {
    const initDb = async () => {
      const db = await SQLite.openDatabaseAsync('phasic_log');
      await db.execAsync(`
      


      DROP TABLE exercise;



      CREATE TABLE IF NOT EXISTS exercise (
        exerciseID INTEGER PRIMARY KEY AUTOINCREMENT, 
        exerciseName TEXT
        ); 



      DROP TABLE exerciseSet;



      CREATE TABLE IF NOT EXISTS exerciseSet (
        setID INTEGER PRIMARY KEY AUTOINCREMENT, 
        exerciseID INTEGER, 
        exerciseDate TEXT,
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