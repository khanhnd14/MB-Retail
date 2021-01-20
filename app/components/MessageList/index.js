import * as React from 'react';
import { FlatList, Keyboard, PanResponderGestureState, PanResponder } from 'react-native';

const MessageList = (props) => {
  const keyboardPosY = React.useRef(0);
  const isVisibleKeyboard = React.useRef(false);
  const accessoryViewHeight = 53 / 2;
  const innerRef = { props }

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (ev) => {
        keyboardPosY.current = ev.endCoordinates.screenY;
        isVisibleKeyboard.current = true;
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        isVisibleKeyboard.current = false;
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    }
  }, []);

  const isDropZone = React.useCallback((gesture) => (gesture.moveY + accessoryViewHeight) > keyboardPosY.current, []);

  const panResponder = React.useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      if (isVisibleKeyboard.current) {
        if (isDropZone(gesture)) {
          Keyboard.dismiss();
          isVisibleKeyboard.current = false;
        }
      }
    }
  }), []);

  return (
    <FlatList
      {...panResponder.panHandlers}
      {...props}
      showsVerticalScrollIndicator={false}
      ref={innerRef}
    />
  );
};

export default MessageList;
