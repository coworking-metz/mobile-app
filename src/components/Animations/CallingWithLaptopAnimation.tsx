import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import CallingWithLaptop from '@/assets/animations/calling-with-laptop.json';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'> & { color?: string };

const CallingWithLaptopAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { color, ...props },
  ref,
) => {
  const colorizedSource = useMemo(
    () =>
      colouriseLottie(CallingWithLaptop, {
        // b_hover-phone-ring..primary.design.Group 1.Fill 1
        // "assets.0.layers.0.shapes.0.it.2.c.k": "#ffffff",
        // // b_hover-phone-ring..primary.design.Group 1.Fill 1
        // "assets.0.layers.1.shapes.0.it.2.c.k": "#ffffff",
        // // b_hover-phone-ring..primary.design.Group 1.Stroke 1
        // "assets.0.layers.2.shapes.0.it.1.c.k": "#ffffff",
        // // b_hover-phone-ring..primary.design.Group 1.Stroke 1
        // "assets.0.layers.3.shapes.0.it.1.c.k": "#ffffff",
        // // b_hover-phone-ring..primary.design.Group 1.Stroke 1
        // "assets.0.layers.4.shapes.0.it.1.c.k": "#ffffff",
        // // b_hover-phone-ring..primary.design.Group 1.Stroke 1
        // "assets.0.layers.5.shapes.0.it.1.c.k": "#ffffff",
        // // Man.Right-Arm.Limb.Upper Group.Rigged Upper.Sholder Group.Group 5.Stroke 1
        // "assets.1.layers.1.shapes.0.it.0.it.0.it.0.it.0.it.2.c.k": "#1f0c0f",
        // // Man.Right-Arm.Limb.Upper Group.Rigged Upper.Sholder Group.Group 4.Stroke 1
        // "assets.1.layers.1.shapes.0.it.0.it.0.it.0.it.1.it.2.c.k": "#1f0c0f",
        // // Man.Right-Arm.Limb.Upper Group.Rigged Upper.Sholder Group.Group 3.Stroke 1
        // "assets.1.layers.1.shapes.0.it.0.it.0.it.0.it.2.it.1.c.k": "#2894fb",
        // // Man.Right-Arm.Limb.Upper Group.Rigged Upper.Sholder Group.Group 3.Fill 1
        // "assets.1.layers.1.shapes.0.it.0.it.0.it.0.it.2.it.2.c.k": "#2894fb",
        // // Man.Right-Arm.Limb.Upper Group.Rigged Upper.Sholder Group.Group 2.Stroke 1
        // "assets.1.layers.1.shapes.0.it.0.it.0.it.0.it.3.it.1.c.k": "#2894fb",
        // // Man.Right-Arm.Limb.Upper Group.Rigged Upper.Sholder Group.Group 2.Fill 1
        // "assets.1.layers.1.shapes.0.it.0.it.0.it.0.it.3.it.2.c.k": "#f8a29a",
        // // Man.Right-Arm.Limb.Upper Group.C1 Group.Fill
        // "assets.1.layers.1.shapes.0.it.0.it.1.it.1.c.k.0.s": "#2894fb",
        // // Man.Right-Arm.Limb.Upper Group.C1 Group.Fill
        // "assets.1.layers.1.shapes.0.it.0.it.1.it.1.c.k.1.s": "#2894fb",
        // // Man.Right-Arm.Limb.Upper Group.C2 Group.Fill
        // "assets.1.layers.1.shapes.0.it.0.it.2.it.1.c.k.0.s": "#f8a29a",
        // // Man.Right-Arm.Limb.Upper Group.C2 Group.Fill
        // "assets.1.layers.1.shapes.0.it.0.it.2.it.1.c.k.1.s": "#f8a29a",
        // // Man.Right-Arm.Limb.Lower Group.Rigged Lower.Wrist R Group.Wrist R.Fill 1
        // "assets.1.layers.1.shapes.0.it.1.it.0.it.0.it.0.it.1.c.k": "#f8a29a",
        // // Man.Right-Arm.Limb.Lower Group.C2 Group.Fill
        // "assets.1.layers.1.shapes.0.it.1.it.1.it.1.c.k.0.s": "#f8a29a",
        // // Man.Right-Arm.Limb.Lower Group.C2 Group.Fill
        // "assets.1.layers.1.shapes.0.it.1.it.1.it.1.c.k.1.s": "#f8a29a",
        // // Man.Right-Arm.Limb.Lower Group.C3 Group.Fill
        // "assets.1.layers.1.shapes.0.it.1.it.2.it.1.c.k.0.s": "#f8a29a",
        // // Man.Right-Arm.Limb.Lower Group.C3 Group.Fill
        // "assets.1.layers.1.shapes.0.it.1.it.2.it.1.c.k.1.s": "#f8a29a",
        // // Man.Sholder R.Group 3.Group 3.Fill 1
        // "assets.1.layers.2.shapes.0.it.0.it.1.c.k": "#2894fb",
        // // Man.Phone 3.Phone.Fill 1
        // "assets.1.layers.3.shapes.0.it.1.c.k": "#282828",
        // // Man.Phone.Phone.Fill 1
        // "assets.1.layers.4.shapes.0.it.1.c.k": "#282828",
        // // Man.Hand R.Hand R.Fill 1
        // "assets.1.layers.5.shapes.0.it.1.c.k": "#f8a29a",
        // // Man.Laptop.Group 1.Fill 1
        // "assets.1.layers.6.shapes.0.it.1.c.k": "#aebac5",
        // // Man.Laptop.Group 2.Fill 1
        // "assets.1.layers.6.shapes.1.it.1.c.k": "#aebac5",
        // // Man.Head.Group 1.Fill 1
        // "assets.1.layers.7.shapes.0.it.1.c.k": "#f56334",
        // // Man.Head.Group 2.Fill 1
        // "assets.1.layers.7.shapes.1.it.1.c.k": "#f56334",
        // // Man.Head.Group 3.Group 1.Stroke 1
        // "assets.1.layers.7.shapes.2.it.0.it.1.c.k": "#000000",
        // // Man.Head.Group 3.Group 2.Fill 1
        // "assets.1.layers.7.shapes.2.it.1.it.1.c.k": "#f8a29a",
        // // Man.Head.Group 4.Fill 1
        // "assets.1.layers.7.shapes.3.it.1.c.k": "#f56334",
        // // Man.Head.Group 5.Stroke 1
        // "assets.1.layers.7.shapes.4.it.1.c.k": "#000000",
        // // Man.Head.Group 6.Group 1.Fill 1
        // "assets.1.layers.7.shapes.5.it.0.it.1.c.k": "#1d0300",
        // // Man.Head.Group 6.Group 2.Fill 1
        // "assets.1.layers.7.shapes.5.it.1.it.1.c.k": "#000000",
        // // Man.Head.Group 7.Fill 1
        // "assets.1.layers.7.shapes.6.it.1.c.k": "#f8a29a",
        // // Man.Head.Group 8.Fill 1
        // "assets.1.layers.7.shapes.7.it.1.c.k": "#f8a29a",
        // // Man.Head.Group 9.Fill 1
        // "assets.1.layers.7.shapes.8.it.1.c.k": "#f56334",
        // // Man.Neck.Group 1.Fill 1
        // "assets.1.layers.8.shapes.0.it.1.c.k": "#000000",
        // // Man.Neck.Group 2.Fill 1
        // "assets.1.layers.8.shapes.1.it.1.c.k": "#f8a29a",
        // // Man.Body.Group 1.Stroke 1
        // "assets.1.layers.9.shapes.0.it.1.c.k": "#1d0300",
        // // Man.Body.Group 2.Fill 1
        // "assets.1.layers.9.shapes.1.it.1.c.k": "#f8a29a",
        // // Man.Body.Group 3.Fill 1
        // "assets.1.layers.9.shapes.2.it.1.c.k": "#2894fb",
        // // Man.Left-Arm.Limb.Upper Group.Distal Upper.Fill
        // "assets.1.layers.11.shapes.0.it.0.it.0.it.1.c.k.0.s": "#f08b85",
        // // Man.Left-Arm.Limb.Upper Group.Distal Upper.Fill
        // "assets.1.layers.11.shapes.0.it.0.it.0.it.1.c.k.1.s": "#f08b85",
        // // Man.Left-Arm.Limb.Upper Group.Proximal Upper.Fill
        // "assets.1.layers.11.shapes.0.it.0.it.1.it.1.c.k.0.s": "#2d8ceb",
        // // Man.Left-Arm.Limb.Upper Group.Proximal Upper.Fill
        // "assets.1.layers.11.shapes.0.it.0.it.1.it.1.c.k.1.s": "#2d8ceb",
        // // Man.Left-Arm.Limb.Lower Group.Proximal Lower.Fill
        // "assets.1.layers.11.shapes.0.it.1.it.0.it.1.c.k.0.s": "#f08b85",
        // // Man.Left-Arm.Limb.Lower Group.Proximal Lower.Fill
        // "assets.1.layers.11.shapes.0.it.1.it.0.it.1.c.k.1.s": "#f08b85",
        // // Man.Left-Arm.Limb.Lower Group.Distal Lower.Fill
        // "assets.1.layers.11.shapes.0.it.1.it.1.it.1.c.k.0.s": "#f08b85",
        // // Man.Left-Arm.Limb.Lower Group.Distal Lower.Fill
        // "assets.1.layers.11.shapes.0.it.1.it.1.it.1.c.k.1.s": "#f08b85",
        // // Man.Hand L.Hand L.Fill 1
        // "assets.1.layers.12.shapes.0.it.1.c.k": "#f08b85",
        // // Man.Right-Leg.Limb.Upper Group.Distal Upper.Fill
        // "assets.1.layers.14.shapes.0.it.0.it.0.it.1.c.k.0.s": "#404eb1",
        // // Man.Right-Leg.Limb.Upper Group.Distal Upper.Fill
        // "assets.1.layers.14.shapes.0.it.0.it.0.it.1.c.k.1.s": "#404eb1",
        // // Man.Right-Leg.Limb.Upper Group.Proximal Upper.Fill
        // "assets.1.layers.14.shapes.0.it.0.it.1.it.1.c.k.0.s": "#404eb1",
        // // Man.Right-Leg.Limb.Upper Group.Proximal Upper.Fill
        // "assets.1.layers.14.shapes.0.it.0.it.1.it.1.c.k.1.s": "#404eb1",
        // // Man.Right-Leg.Limb.Lower Group.Proximal Lower.Fill
        // "assets.1.layers.14.shapes.0.it.1.it.0.it.1.c.k.0.s": "#404eb1",
        // // Man.Right-Leg.Limb.Lower Group.Proximal Lower.Fill
        // "assets.1.layers.14.shapes.0.it.1.it.0.it.1.c.k.1.s": "#404eb1",
        // // Man.Right-Leg.Limb.Lower Group.Distal Lower.Fill
        // "assets.1.layers.14.shapes.0.it.1.it.1.it.1.c.k.0.s": "#404eb1",
        // // Man.Right-Leg.Limb.Lower Group.Distal Lower.Fill
        // "assets.1.layers.14.shapes.0.it.1.it.1.it.1.c.k.1.s": "#404eb1",
        // // Man.Shoes R.Group 1.Stroke 1
        // "assets.1.layers.15.shapes.0.it.1.c.k": "#ffffff",
        // // Man.Shoes R.Group 2.Stroke 1
        // "assets.1.layers.15.shapes.1.it.1.c.k": "#ffffff",
        // // Man.Shoes R.Group 3.Group 1.Fill 1
        // "assets.1.layers.15.shapes.2.it.0.it.1.c.k": "#e6e9ff",
        // // Man.Shoes R.Group 4.Fill 1
        // "assets.1.layers.15.shapes.3.it.1.c.k": "#070707",
        // // Man.Ankle R.Ankle R.Fill 1
        // "assets.1.layers.16.shapes.0.it.1.c.k": "#f8a29a",
        // // Man.Stool.Group 1.Fill 1
        // "assets.1.layers.17.shapes.0.it.1.c.k": "#c1ccd4",
        // // Man.Stool.Group 2.Stroke 1
        // "assets.1.layers.17.shapes.1.it.1.c.k": "#000000",
        // // Man.Left-Leg.Limb.Upper Group.Distal Upper.Fill
        // "assets.1.layers.19.shapes.0.it.0.it.0.it.1.c.k.0.s": "#2b3c95",
        // // Man.Left-Leg.Limb.Upper Group.Distal Upper.Fill
        // "assets.1.layers.19.shapes.0.it.0.it.0.it.1.c.k.1.s": "#2b3c95",
        // // Man.Left-Leg.Limb.Upper Group.Proximal Upper.Fill
        // "assets.1.layers.19.shapes.0.it.0.it.1.it.1.c.k.0.s": "#2b3c95",
        // // Man.Left-Leg.Limb.Upper Group.Proximal Upper.Fill
        // "assets.1.layers.19.shapes.0.it.0.it.1.it.1.c.k.1.s": "#2b3c95",
        // // Man.Left-Leg.Limb.Lower Group.Proximal Lower.Fill
        // "assets.1.layers.19.shapes.0.it.1.it.0.it.1.c.k.0.s": "#2b3c95",
        // // Man.Left-Leg.Limb.Lower Group.Proximal Lower.Fill
        // "assets.1.layers.19.shapes.0.it.1.it.0.it.1.c.k.1.s": "#2b3c95",
        // // Man.Left-Leg.Limb.Lower Group.Distal Lower.Fill
        // "assets.1.layers.19.shapes.0.it.1.it.1.it.1.c.k.0.s": "#2b3c95",
        // // Man.Left-Leg.Limb.Lower Group.Distal Lower.Fill
        // "assets.1.layers.19.shapes.0.it.1.it.1.it.1.c.k.1.s": "#2b3c95",
        // // Man.Shoes L.Group 1.Stroke 1
        // "assets.1.layers.20.shapes.0.it.1.c.k": "#ffffff",
        // // Man.Shoes L.Group 2.Stroke 1
        // "assets.1.layers.20.shapes.1.it.1.c.k": "#ffffff",
        // // Man.Shoes L.Group 3.Group 1.Fill 1
        // "assets.1.layers.20.shapes.2.it.0.it.1.c.k": "#e5e9ff",
        // // Man.Shoes L.Group 4.Fill 1
        // "assets.1.layers.20.shapes.3.it.1.c.k": "#070707",
        // // Man.Ankle L.Ankle L.Fill 1
        // "assets.1.layers.21.shapes.0.it.1.c.k": "#f8a29a",
        // // Arrow.Group 3.Fill 1
        // "layers.2.shapes.0.it.1.c.k": "#60d3a8",
        // // Dots.Group 1.Fill 1
        // "layers.3.shapes.0.it.1.c.k": "#ffffff",
        // // Dots.Group 2.Fill 1
        // "layers.3.shapes.1.it.1.c.k": "#ffffff",
        // // Dots.Group 3.Fill 1
        // "layers.3.shapes.2.it.1.c.k": "#ffffff",
        // // Dots.Group 4.Fill 1
        // "layers.3.shapes.3.it.1.c.k": "#2894fb",
        // // Floor Line.Floor Line.Stroke 1
        // "layers.4.shapes.0.it.1.c.k": "#909498",
        // // Table.Group 1.Fill 1
        // "layers.5.shapes.0.it.1.c.k": "#13274e",
        // // Table.Group 2.Stroke 1
        // "layers.5.shapes.1.it.1.c.k": "#60d3a8",
        // // Table.Group 3.Stroke 1
        // "layers.5.shapes.2.it.1.c.k": "#60d3a8",
      }),
    [],
  );

  return <LottieView ref={ref} {...props} source={colorizedSource} />;
};

export default forwardRef(CallingWithLaptopAnimation);
