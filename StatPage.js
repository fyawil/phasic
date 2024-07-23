import { Text, View, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import { Dropdown } from 'react-native-element-dropdown';
import { LineChart } from "react-native-chart-kit";

export const StatPage = () => {
  const [displayedExercise, setDisplayedExercise] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const extractExerciseNamesFromDB = async () => {
      // Opens the database
      const db = await SQLite.openDatabaseAsync('phasic_log');
      // Gets current exercises in db and adds it to the dropdown menu
      const res = await db.getAllAsync('SELECT exerciseName FROM exercise');
      setData(res.map(ex => ({ label: ex.exerciseName, value: ex.exerciseName })));
    };
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
        }} />
      <ExerciseChart displayedExercise={displayedExercise} />
    </>
  );
};
const ExerciseChart = ({ displayedExercise }) => {
  // Make this timed one and one for non-timed split out
  const [lineData, setLineData] = useState({
    labels: ["Day 1", "Day 2", "Day 3"],
    datasets: [
      {
        data: [10, 10, 10]
      }
    ]
  });

  const [yAxisUnits, setYAxisUnits] = useState("");

  useEffect(() => {
    const extractLineData = async (displayedExercise) => {
      // Opens the database
      const db = await SQLite.openDatabaseAsync('phasic_log');
      // Extracts x-axis (date) and y-axis (average distance) data for the line chart
      const displayedTable = await db.getAllAsync(`
      SELECT 
        exerciseSet.exerciseDate,
        AVG(exerciseSet.exerciseDistance / exerciseSet.exerciseDuration) as averageSpeed
      FROM exerciseSet 
      JOIN exercise ON exercise.exerciseID = exerciseSet.exerciseID
      WHERE exercise.exerciseName = ?
      GROUP BY exerciseSet.exerciseDate`, [displayedExercise]);
    

      // Extract x-axis labels array (dates)
      const xAxisLabelResults = displayedTable.map(row => row.exerciseDate);

      // Extract y-axis labels array (average distances)
      const yAxisLabelResults = displayedTable.map(row => row.averageSpeed);


      setLineData({
        labels: xAxisLabelResults,
        datasets: [
          {
            data: yAxisLabelResults
          }
        ]
      });
    };

    if (displayedExercise) {
      extractLineData(displayedExercise);
    }
  }, [displayedExercise]);

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;


  return (
    <View>
      <Text>{displayedExercise}</Text>
      <LineChart
      style={{ transform: 'rotate(90deg)' }}
      data={lineData}
      width={screenHeight}
      height={screenWidth}
      yAxisSuffix={yAxisUnits}
      withVerticalLabels={true}
      withHorizontalLabels={true}
      yAxisInterval={1}
      chartConfig={{
        backgroundColor: "#ffffff",
        backgroundGradientFrom: "#f3f4f6",
        backgroundGradientTo: "#e2e8f0",
        decimalPlaces: 2,
        color: (opacity = 1) => `rgba(75, 85, 99, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
        propsForDots: {
          r: "4",
          strokeWidth: "2",
          stroke: "#3b82f6"
        }
      }}
      bezier
    />
    </View>
  );
};
