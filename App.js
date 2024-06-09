import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Pressable, Text, TextInput, View } from 'react-native';
import { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import { Dropdown } from 'react-native-element-dropdown';
import { LineChart } from "react-native-chart-kit";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useIsFocused } from '@react-navigation/native';

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
        isExerciseTimed BOOLEAN,
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
  const [isExerciseNameValid, setIsExerciseNameValid] = useState(true)
  const [exerciseReps, setExerciseReps] = useState('');
  const [isExerciseRepsValid, setIsExerciseRepsValid] = useState(true)
  const [exerciseWeight, setExerciseWeight] = useState('');
  const [isExerciseWeightValid, setIsExerciseWeightValid] = useState(true)
  const [exerciseDuration, setExerciseDuration] = useState('');
  const [isExerciseDurationValid, setIsExerciseDurationValid] = useState(true)
  const [exerciseDistance, setExerciseDistance] = useState('');
  const [isExerciseDistanceValid, setIsExerciseDistanceValid] = useState(true)
  const [exerciseDate, setExerciseDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [isExerciseTimed, setIsExerciseTimed] = useState(true);

  const validateExerciseName = (text) => {
    const trimmedText = text.trim();
    const isValid = /^[A-Za-z]{4,50}$/.test(trimmedText);
    setIsExerciseNameValid(isValid);
    return isValid;
  };
  
  const validateExerciseReps = (text) => {
    const trimmedText = text.trim();
    const isValid = /^[1-9]\d*$/.test(trimmedText);
    setIsExerciseRepsValid(isValid);
    return isValid;
  };
  
  const validateExerciseWeight = (text) => {
    const trimmedText = text.trim();
    const isValid = trimmedText === '' || /^\d+(\.\d+)?$/.test(trimmedText);
    setIsExerciseWeightValid(isValid);
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
  

  // Resets all input fields, except date, and placeholder colors
  const resetInputFields = () => {
    setExerciseName('');
    setExerciseReps('');
    setExerciseWeight('');
    setExerciseDuration('');
    setExerciseDistance('');
    setIsExerciseNameValid(true);
    setIsExerciseRepsValid(true);
    setIsExerciseWeightValid(true);
    setIsExerciseDurationValid(true);
    setIsExerciseDistanceValid(true);
  }

  // Inserts workout set details into the database
  const handlePressSubmitSet = async () => {

    if (
      isExerciseTimed && validateExerciseName(exerciseName) && validateExerciseDuration(exerciseDuration) && validateExerciseDistance(exerciseDistance)
      ||
      !isExerciseTimed && validateExerciseName(exerciseName) && validateExerciseReps(exerciseReps) && validateExerciseWeight(exerciseWeight)
    ) {
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
      await db.runAsync('INSERT INTO exerciseSet (exerciseID, exerciseDate, isExerciseTimed, exerciseReps, exerciseWeight, exerciseDuration, exerciseDistance) VALUES (?, ?, ?, ?, ?, ?, ?)', exerciseID['exerciseID'], exerciseDate, isExerciseTimed ? true : false, exerciseReps, exerciseWeight, exerciseDuration, exerciseDistance);
      resetInputFields();
    }

  }



  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || exerciseDate; // Ensure we handle the case where the user cancels the picker
    setShow(false); // Hide the date picker after selection
    setExerciseDate(currentDate); // Update the date state with the selected date
  };

  const showDatepicker = () => {
    setShow(true); // Show the date picker when the user presses the button
  };

  const handleSwitchMode = () => {
    setIsExerciseTimed(!isExerciseTimed)
    resetInputFields();
  }

  return (
    <>
      {/* Button to switch between timed and counted exercise */}
      <Pressable onPress={handleSwitchMode}><Text>{isExerciseTimed ? `Time Mode` : `Rep Mode`}</Text></Pressable>
      {/* Input fields for the set details */}
      <SafeAreaView>
        <Pressable onPress={showDatepicker}><Text>{exerciseDate.toLocaleDateString()}</Text></Pressable>
        {show && (
          <DateTimePicker
            value={exerciseDate}
            mode='date'
            onChange={onChange}
            maximumDate={(new Date())}
          />
        )}
      </SafeAreaView>
      <TextInput 
  value={exerciseName} 
  placeholder='exercise' 
  onChangeText={(text) => { 
    setExerciseName(text); 
    validateExerciseName(text); // Pass the text parameter to the validation function
  }} 
  style={{ color: isExerciseNameValid ? 'black' : 'red' }}
/>
{!isExerciseTimed &&
  <TextInput 
  value={exerciseReps} 
  placeholder='reps' 
  onChangeText={(text) => { 
    setExerciseReps(text); 
    validateExerciseReps(text); 
  }} 
  style={{ color: isExerciseRepsValid ? 'black' : 'red' }}
/>
}
{!isExerciseTimed &&
<TextInput 
  value={exerciseWeight} 
  placeholder='weight' 
  onChangeText={(text) => { 
    setExerciseWeight(text); 
    validateExerciseWeight(text); 
  }} 
  style={{ color: isExerciseWeightValid ? 'black' : 'red' }}
/>
}
{isExerciseTimed &&
<TextInput 
  value={exerciseDuration} 
  placeholder='duration' 
  onChangeText={(text) => { 
    setExerciseDuration(text); 
    validateExerciseDuration(text); 
  }} 
  style={{ color: isExerciseDurationValid ? 'black' : 'red' }}
/>
}
{isExerciseTimed &&
<TextInput 
  value={exerciseDistance} 
  placeholder='distance' 
  onChangeText={(text) => { 
    setExerciseDistance(text); 
    validateExerciseDistance(text); 
  }} 
  style={{ color: isExerciseDistanceValid ? 'black' : 'red' }}
/>
}


      {/* Submits the set to the db if pressed */}
      <Pressable onPress={handlePressSubmitSet}>
        <Text>Submit Set</Text>
      </Pressable>
    </>
  );
};

const StatPage = () => {
  const [displayedExercise, setDisplayedExercise] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const extractExerciseNamesFromDB = async () => {
      // Opens the database
      const db = await SQLite.openDatabaseAsync('phasic_log');
      // Gets current exercises in db and adds it to the dropdown menu
      const res = await db.getAllAsync('SELECT exerciseName FROM exercise');
      setData(res.map(ex => ({ label: ex.exerciseName, value: ex.exerciseName })));
    }
    extractExerciseNamesFromDB();
  }, []);

  return (
    <>
      <Dropdown
        data={data}
        labelField="label"
        valueField="value"
        onChange={item => {
          setDisplayedExercise(item.value);
        }}
      />
      <ExerciseChart displayedExercise={displayedExercise} />
    </>
  );
};

const ExerciseChart = ({ displayedExercise }) => {
  const [lineData, setLineData] = useState({
    labels: ["Day 1", "Day 2", "Day 3"],
    datasets: [
      {
        data: [10, 20, 30]
      }
    ]
  });
  const [yAxisUnits, setYAxisUnits] = useState("kg");

  useEffect(() => {
    const extractLineData = async (displayedExercise) => {
      // Opens the database
      const db = await SQLite.openDatabaseAsync('phasic_log');
    // Extracts y-axis labels array for the line chart
    const yAxisLabelResults = await db.getAllAsync(`
      SELECT exerciseSet.exerciseDistance
      FROM exerciseSet 
      JOIN exercise ON exercise.exerciseID = exerciseSet.exerciseID
      WHERE exercise.exerciseName = ?`, [displayedExercise]);

    // Extracts x-axis data array for the line chart
    const xAxisLabelResults = await db.getAllAsync(`
      SELECT exerciseSet.exerciseDate
      FROM exerciseSet 
      JOIN exercise ON exercise.exerciseID = exerciseSet.exerciseID
      WHERE exercise.exerciseName = ?`, [displayedExercise]);


      setLineData({
        labels: yAxisLabelResults.map(res => res.exerciseDistance),
        datasets: [
          {
            data: xAxisLabelResults.map(res => res.exerciseDate)
          }
        ]
      });
    }

    if (displayedExercise) {
      extractLineData(displayedExercise);
    }
  }, [displayedExercise]);

  return (
    <View>
      <Text>{displayedExercise}</Text>
      <LineChart
        data={lineData}
        width={220}
        height={220}
        yAxisSuffix={yAxisUnits}
        yAxisInterval={10}
        chartConfig={{
          backgroundColor: "#ffffff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          propsForDots: {
            r: "2",
            strokeWidth: "2",
            stroke: "#ffffff"
          }
        }}
        bezier
      />
    </View>
  );
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