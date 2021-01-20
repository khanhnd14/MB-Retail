import React, { useState, useCallback } from 'react';
import { CalendarList } from 'react-native-calendars';
import { Text, View } from 'react-native';

const CalendarsList = ({ handleSelectDate }) => {
  const [dateString, setDateString] = useState('');
  const onSelectDate = useCallback(
    (date) => {
      console.log(date);
      setDateString(date.dateString);
      setTimeout(() => {
        handleSelectDate(date)
      }, 0);
    },
    [dateString],
  )
  return (
    <CalendarList
      testID="calendarList"
      current="2020-06-10"
      pastScrollRange={24}
      futureScrollRange={24}
      markedDates={{
        [dateString]: {
          selected: true,
          disableTouchEvent: true,
          selectedColor: '#FF3B30',
          selectedTextColor: 'white'
        }
      }}
      onDayPress={onSelectDate}
      renderHeader={(date) => {
        const header = date.toString('MMMM yyyy');
        const [month, year] = header.split(' ');
        const textStyle = {
          fontSize: 18,
          fontWeight: 'bold',
          paddingTop: 10,
          paddingBottom: 10,
          color: '#FF3B30',
          paddingRight: 5
        };

        return (
          <View style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginTop: 10,
            marginBottom: 10
          }}
          >
            <Text style={{ marginLeft: 5, ...textStyle }}>{`${month}`}</Text>
            {/* <Text style={{marginRight: 5, ...textStyle}}>{year}</Text> */}
          </View>
        );
      }}
      theme={{
        todayTextColor: '#FF3B30'
      }}
    />
);
};

export default CalendarsList;
