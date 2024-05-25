import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';

export default function App() {
  const [isDisplayPageShown, setIsDisplayPageShown] = useState(false);
  const [result, setResult] = useState([]);

  useEffect(() => {
    const initDb = async () => {
      const db = await SQLite.openDatabaseAsync('test_db');

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER);
        INSERT INTO test (value, intValue) VALUES ('test1', 123);
        INSERT INTO test (value, intValue) VALUES ('test2', 456);
        INSERT INTO test (value, intValue) VALUES ('test3', 789);
      `);

      const res = await db.getAllAsync('SELECT * FROM test');
      setResult(res);
    };

    initDb();
  }, []);

  return (
    <View>
      <StatusBar hidden />
      <NavigationBar setIsDisplayPageShown={setIsDisplayPageShown} />

      <View>
        {!isDisplayPageShown && <InputPage result={result} />}
        {isDisplayPageShown && <DisplayPage />}
      </View>
    </View>
  );
}

const InputPage = ({ result }) => {
  return (
    <>
      <Text>Input Page</Text>
      <Text>{JSON.stringify(result)}</Text>
    </>
  );
};

const DisplayPage = () => {
  return <Text>Display Page</Text>;
};

const NavigationBar = ({ setIsDisplayPageShown }) => {
  const handlePressInputPage = () => setIsDisplayPageShown(false);
  const handlePressDisplayPage = () => setIsDisplayPageShown(true);

  return (
    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
      <Pressable onPress={handlePressInputPage}>
        <Text>Input Page</Text>
      </Pressable>
      <Pressable onPress={handlePressDisplayPage}>
        <Text>Display Page</Text>
      </Pressable>
    </View>
  );
};
