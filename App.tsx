import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { PanGestureHandler, PinchGestureHandler, PinchGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
// import Svg, { Circle, Rect } from 'react-native-svg';

{/* <Svg height="50%" width="50%" viewBox="0 0 100 100" >
  <Circle cx="40" cy="50" r="20" fill="black" />
</Svg> */}

export default function AnimatedStyleUpdateExample() {

  const isZoom = useSharedValue(false);
  const isDrawing = useSharedValue(false);
  const scale = useSharedValue(1);

  const pinchHandler = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
    onStart: (e, ctx: any) => {
      ctx.scale = scale.value;
      if (e.numberOfPointers == 1) {
        isDrawing.value = true;
      } else if (e.numberOfPointers == 2) {
        isZoom.value = true
      }
    },
    onActive: (e, ctx: any) => {
      scale.value = e.scale - (1-ctx.scale);
      console.log(scale.value)
    },
    onFinish: (e) => {
      isZoom.value = false;
      isDrawing.value = false;

    }
  })

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value }
      ]
    }
  })

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'black'
      }}>
      <View>

        <PinchGestureHandler onGestureEvent={pinchHandler}>
          <Animated.View style={[styles.paintContainer, style]} />
        </PinchGestureHandler>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  paintContainer: {
    // flex: 1,
    width: 500,
    height: 500,
    backgroundColor: 'grey'
  }
})
