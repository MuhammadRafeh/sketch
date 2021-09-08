import React, { useState, useRef } from 'react';
import { View, Button, Text, StyleSheet, Dimensions } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent, PinchGestureHandler, PinchGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import Svg, { Circle, Rect } from 'react-native-svg';


const Circles = () => {
  return (
    < Svg height="50%" width="50%" viewBox="0 0 100 100" >
      <Circle cx="40" cy="50" r="1" fill="white" />
    </Svg >

  )
}

const SKETCH_WIDTH = 500
const SKETCH_HEIGHT = 500
const { width, height } = Dimensions.get('window');
//x increases towards right and y towards down

export default function Sketch() {

  const panRef = useRef()
  const pinchRef = useRef();

  const [isDrawings, setIsDrawings] = useState(false);

  const isMoving = useSharedValue(false);
  const isZoom = useSharedValue(false);
  const isDrawing = useSharedValue(false);
  const scale = useSharedValue(1);
  // const focalX = useSharedValue(0);
  // const focalY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const point = useSharedValue([]);

  const x = useSharedValue(0);
  const y = useSharedValue(0);

  const pinchHandler = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
    onStart: (e, ctx: any) => {
      ctx.scale = scale.value;
      // ctx.focalX = focalX.value;
      // ctx.focalY = focalY.value;
      if (e.numberOfPointers == 1) {
        isDrawing.value = true;
      } else if (e.numberOfPointers == 2) {
        isZoom.value = true
      }
    },
    onActive: (e, ctx: any) => {
      scale.value = e.scale - (1 - ctx.scale);
      // focalX.value = ctx.focalX + e.focalX;
      // focalY.value = ctx.focalY + e.focalY;
      // console.log('x',e.focalX, 'y',e.focalY)
    },
    onFinish: (e) => {
      isZoom.value = false;
      isDrawing.value = false;
    }
  })

  const panHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: (e, ctx: any) => {
      console.log('hi')
      ctx.translateX = translateX.value
      ctx.translateY = translateY.value
      isDrawing.value = true;
    },
    onActive: (e, ctx: any) => {
      if (isDrawings) {
        x.value = e.x;
        y.value = e.y;
        point.value.push({ x: x.value, y: y.value })
        return;
      }
      translateX.value = ctx.translateX + e.translationX;
      translateY.value = ctx.translateY + e.translationY;
      // console.log(e.x)
    },
    onFinish: (e) => {

    }
  })

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
      ]
    }
  })

  const panStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value }
      ]
    }
  })

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'black',
        marginTop: 20,
        alignItems: 'center'
      }}>
      <Button title={isDrawings ? 'cancel drawing' : 'do drawing'} onPress={() => setIsDrawings(!isDrawings)} />

      <PanGestureHandler onGestureEvent={panHandler} ref={panRef} simultaneousHandlers={pinchRef}>
        <Animated.View>

          <PinchGestureHandler onGestureEvent={pinchHandler} ref={pinchRef} simultaneousHandlers={panRef}>
            <Animated.View style={[styles.paintContainer, panStyle]}>

            </Animated.View>
          </PinchGestureHandler>

        </Animated.View>
      </PanGestureHandler>


    </View>
  );
}

const styles = StyleSheet.create({
  paintContainer: {
    // flex: 1,
    width: 500,
    height: 500,
    backgroundColor: 'grey',
  }
})
