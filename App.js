import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { useState } from 'react';
import {Picker} from '@react-native-picker/picker';

const Stack = createNativeStackNavigator();

export default function App(){
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

const Home = ({navigation}) => {

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

const Record = () => {
  const [exerciseName, setExerciseName] = useState('')
  const [exerciseRepNumber, setExerciseRepNumber] = useState('')
  const [exerciseRepUnits, setExerciseRepUnits] = useState('reps')
  const [exerciseLoadNumber, setExerciseLoadNumber] = useState('')
  const [exerciseLoadUnits, setExerciseLoadUnits] = useState('kg')

  return (
    <View>
      <TextInput onChangeText={setExerciseName} value={exerciseName} placeholder='Exercise name'/>
      <TextInput onChangeText={setExerciseRepNumber} value={exerciseRepNumber} placeholder='# of Reps' keyboardType='numeric'/>
      <Picker selectedValue={exerciseRepUnits} onValueChange={(itemValue) => setExerciseRepUnits(itemValue)}>
        <Picker.Item label="reps" value="reps" />
        <Picker.Item label="secs" value="secs" />
        <Picker.Item label="min(s)" value="min(s)" />
      </Picker>
      <TextInput onChangeText={setExerciseLoadNumber} value={exerciseLoadNumber} placeholder='Added Weight' keyboardType='numeric'/>
      <Picker selectedValue={exerciseLoadUnits} onValueChange={(itemValue) => setExerciseLoadUnits(itemValue)}>
        <Picker.Item label="kg" value="kg" />
        <Picker.Item label="lbs" value="lbs" />
      </Picker>
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
