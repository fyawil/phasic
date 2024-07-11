import { SafeAreaView, Pressable, Text, TextInput } from 'react-native';
import { useState } from 'react';
import * as SQLite from 'expo-sqlite';
import DateTimePicker from '@react-native-community/datetimepicker';

export const InputPage = () => {

  // State variables tracking the inputs of the user when recording their workout set
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseDuration, setExerciseDuration] = useState('');
  const [exerciseDistance, setExerciseDistance] = useState('');
  const [exerciseDate, setExerciseDate] = useState(new Date());

  // State variables, tracking whether db inputs are valid
  const [isExerciseNameValid, setIsExerciseNameValid] = useState(true);
  const [isExerciseDurationValid, setIsExerciseDurationValid] = useState(true);
  const [isExerciseDistanceValid, setIsExerciseDistanceValid] = useState(true);

  // State variable, tracking whether date picker calendar is shown or not
  const [show, setShow] = useState(false);

  // Validation functions for the db inputs
  const validateExerciseName = (text) => {
    const trimmedText = text.trim();
    const isValid = /^[A-Za-z]{3,50}$/.test(trimmedText);
    setIsExerciseNameValid(isValid);
    return isValid;
  };
  const validateExerciseDuration = (text) => {
    const trimmedText = text.trim();
    const isValid = /^[1-9]\d*(\.\d+)?$/.test(trimmedText);
    setIsExerciseDurationValid(isValid);
    return isValid;
  };
  const validateExerciseDistance = (text) => {
    const trimmedText = text.trim();
    const isValid = /^[1-9]\d*(\.\d+)?$/.test(trimmedText);
    setIsExerciseDistanceValid(isValid);
    return isValid;
  };

  // Resets all input fields, except date
  const resetInputFields = () => {
    setExerciseName('');
    setExerciseDuration('');
    setExerciseDistance('');
    setIsExerciseNameValid(true);
    setIsExerciseDurationValid(true);
    setIsExerciseDistanceValid(true);
  };

  // Inserts workout set details into the database
  const handlePressSubmitSet = async () => {

    if (
      // Validates the db inputs
      validateExerciseName(exerciseName)
      && validateExerciseDuration(exerciseDuration)
      && validateExerciseDistance(exerciseDistance)) {
      // Opens the database
      db = await SQLite.openDatabaseAsync('phasic_log');
      // Adds exercise to exercise table if it does not exist in it already
      const res = await db.getAllAsync('SELECT exerciseName FROM exercise');
      const exercisesInDB = res.map(ex => ex.exerciseName);
      if (exercisesInDB.indexOf(exerciseName.trim()) == -1) {
        await db.runAsync('INSERT INTO exercise (exerciseName) VALUES (?)', exerciseName.trim());
      }
      // Adds set details to the exerciseSet table
      const exerciseID = await db.getFirstAsync(` SELECT exerciseID FROM exercise WHERE exerciseName = ?`, exerciseName);
      await db.runAsync(`
        INSERT INTO exerciseSet (exerciseID, exerciseDate, exerciseDuration, exerciseDistance) 
        VALUES (?, ?, ?, ?)`,
        exerciseID['exerciseID'], exerciseDate.toLocaleDateString(), exerciseDuration, exerciseDistance);
      // Reset db input fields
      resetInputFields();
    }

  };

  // Set the new or current date when user pick it and hides the date picker calendar
  const handleSelectDate = (event, selectedDate) => {
    const currentDate = selectedDate || exerciseDate;
    setShow(false);
    setExerciseDate(currentDate);
  };

  // Show the date picker when the user presses the button
  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <>
      {/* Input fields for the set details */}
      <SafeAreaView>
        <Pressable onPress={showDatepicker}><Text>{exerciseDate.toLocaleDateString()}</Text></Pressable>
        {show && (
          <DateTimePicker
            value={exerciseDate}
            mode='date'
            onChange={handleSelectDate}
            maximumDate={(new Date())} />
        )}
      </SafeAreaView>
      <TextInput
        value={exerciseName}
        placeholder='exercise'
        onChangeText={(text) => {
          setExerciseName(text);
          validateExerciseName(text);
        }}
        style={{ color: isExerciseNameValid ? 'black' : 'red' }} />
      <TextInput
        value={exerciseDuration}
        placeholder='duration'
        onChangeText={(text) => {
          setExerciseDuration(text);
          validateExerciseDuration(text);
        }}
        style={{ color: isExerciseDurationValid ? 'black' : 'red' }} />
      <TextInput
        value={exerciseDistance}
        placeholder='distance'
        onChangeText={(text) => {
          setExerciseDistance(text);
          validateExerciseDistance(text);
        }}
        style={{ color: isExerciseDistanceValid ? 'black' : 'red' }} />


      {/* Submits the set to the db if pressed */}
      <Pressable onPress={handlePressSubmitSet}>
        <Text>Submit Set</Text>
      </Pressable>
    </>
  );
};
