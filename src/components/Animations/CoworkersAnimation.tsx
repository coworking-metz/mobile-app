import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, useMemo, type ForwardRefRenderFunction } from 'react';
import CooperatingCoworkers from '@/assets/animations/cooperating-coworkers.json';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'> & { color?: string };

const CoworkersAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { ...props },
  ref,
) => {
  const colorizedSource = useMemo(
    () =>
      colouriseLottie(CooperatingCoworkers, {
        // PC.Group 1.Fill 1
        // "assets.0.layers.0.shapes.0.it.1.c.k": "#ffffff",
        // // PC.Group 2.Fill 1
        // "assets.0.layers.0.shapes.1.it.1.c.k": "#eac8ce",
        // // Forearm_Detail.Group 23.Stroke 1
        // "assets.0.layers.1.shapes.0.it.1.c.k": "#55382c",
        // // Forearm.Group 25.Fill 1
        // "assets.0.layers.2.shapes.0.it.1.c.k": "#e88e80",
        // // Forearm_Detail.Group 27.Stroke 1
        // "assets.0.layers.3.shapes.0.it.1.c.k": "#55382c",
        // // Forearm.Group 29.Fill 1
        // "assets.0.layers.4.shapes.0.it.1.c.k": "#e88e80",
        // // Colar.Group 1.Group 1.Fill 1
        // "assets.0.layers.5.shapes.0.it.0.it.1.c.k": "#ffffff",
        // // Colar.Group 2.Group 2.Fill 1
        // "assets.0.layers.5.shapes.1.it.0.it.1.c.k": "#ffffff",
        // // Hair.Group 4.Group 4.Fill 1
        // "assets.0.layers.6.shapes.0.it.0.it.1.c.k": "#0b181b",
        // // Hair.Group 5.Group 5.Fill 1
        // "assets.0.layers.6.shapes.1.it.0.it.1.c.k": "#0b181b",
        // // Smile.Group 6.Fill 1
        // "assets.0.layers.8.shapes.0.it.1.c.k": "#ffffff",
        // // Eyebrow.Group 7.Fill 1
        // "assets.0.layers.9.shapes.0.it.1.c.k": "#0b181b",
        // // Eyebrow.Group 8.Fill 1
        // "assets.0.layers.10.shapes.0.it.1.c.k": "#0b181b",
        // // Nose.Group 9.Stroke 1
        // "assets.0.layers.11.shapes.0.it.1.c.k": "#021833",
        // // Eye.Group 10.Fill 1
        // "assets.0.layers.12.shapes.0.it.1.c.k": "#0b181b",
        // // Eye.Group 11.Fill 1
        // "assets.0.layers.13.shapes.0.it.1.c.k": "#0b181b",
        // // Side_hair.Group 12.Fill 1
        // "assets.0.layers.14.shapes.0.it.1.c.k": "#0b181b",
        // // Ear.Group 115.Group 15.Stroke 1
        // "assets.0.layers.15.shapes.0.it.0.it.1.c.k": "#021833",
        // // Ear.Group 116.Group 16.Fill 1
        // "assets.0.layers.15.shapes.1.it.0.it.1.c.k": "#e88e80",
        // // Side_hair.Group 3.Group 3.Fill 1
        // "assets.0.layers.16.shapes.0.it.0.it.1.c.k": "#0b181b",
        // // Face.Group 14.Fill 1
        // "assets.0.layers.17.shapes.0.it.1.c.k": "#e88e80",
        // // Ear.Group 117.Group 17.Stroke 1
        // "assets.0.layers.18.shapes.0.it.0.it.1.c.k": "#021833",
        // // Ear.Group 118.Group 18.Fill 1
        // "assets.0.layers.18.shapes.1.it.0.it.1.c.k": "#e88e80",
        // // Back_Hair.Group 19.Fill 1
        // "assets.0.layers.19.shapes.0.it.1.c.k": "#0b181b",
        // // Neck.Group 220.Group 20.Fill 1
        // "assets.0.layers.20.shapes.0.it.0.it.1.c.k": "#0b0b0b",
        // // Neck.Group 221.Group 21.Fill 1
        // "assets.0.layers.20.shapes.1.it.0.it.1.c.k": "#e88e80",
        // // Arm.Group 222.Group 22.Fill 1
        // "assets.0.layers.21.shapes.0.it.0.it.1.c.k": "#0086ff",
        // // Arm.Group 224.Group 24.Fill 1
        // "assets.0.layers.21.shapes.1.it.0.it.1.c.k": "#e88e80",
        // // Arm.Group 226.Group 26.Fill 1
        // "assets.0.layers.22.shapes.0.it.0.it.1.c.k": "#0086ff",
        // // Arm.Arm.Group 28.Fill 1
        // "assets.0.layers.22.shapes.1.it.0.it.1.c.k": "#e88e80",
        // // Chest.Group 30.Fill 1
        // "assets.0.layers.23.shapes.0.it.1.c.k": "#0086ff",
        // // Shoes.Group 332.Group 32.Stroke 1
        // "assets.0.layers.24.shapes.0.it.0.it.1.c.k": "#ffffff",
        // // Shoes.Group 333.Group 33.Fill 1
        // "assets.0.layers.24.shapes.1.it.0.it.1.c.k": "#ffffff",
        // // Shoes.Group 334.Group 34.Fill 1
        // "assets.0.layers.24.shapes.2.it.0.it.1.c.k": "#000000",
        // // Shoes.Group 338.Group 38.Stroke 1
        // "assets.0.layers.25.shapes.0.it.0.it.1.c.k": "#ffffff",
        // // Shoes.Group 339.Group 39.Fill 1
        // "assets.0.layers.25.shapes.1.it.0.it.1.c.k": "#ffffff",
        // // Shoes.Group 440.Group 40.Fill 1
        // "assets.0.layers.25.shapes.2.it.0.it.1.c.k": "#000000",
        // // Leg_Right.Group 331.Group 31.Fill 1
        // "assets.0.layers.26.shapes.0.it.0.it.1.c.k": "#0b181b",
        // // Leg_Right.Group 335.Group 35.Fill 1
        // "assets.0.layers.26.shapes.1.it.0.it.1.c.k": "#f9b0a3",
        // // Leg_Right.Group 336.Group 36.Fill 1
        // "assets.0.layers.26.shapes.2.it.0.it.1.c.k": "#0b181b",
        // // Leg_Left.Group 337.Group 37.Fill 1
        // "assets.0.layers.27.shapes.0.it.0.it.1.c.k": "#0b181b",
        // // Leg_Left.Group 441.Group 41.Fill 1
        // "assets.0.layers.27.shapes.1.it.0.it.1.c.k": "#f9b0a3",
        // // Leg_Left.Group 442.Group 42.Fill 1
        // "assets.0.layers.27.shapes.2.it.0.it.1.c.k": "#0b181b",
        // // C | Hand.Anchor.Stroke 1
        // "assets.1.layers.0.shapes.0.it.3.c.k.0.s": "#000000",
        // // C | Hand.Anchor.Stroke 1
        // "assets.1.layers.0.shapes.0.it.3.c.k.1.s": "#000000",
        // // C | Hand.Icon.Fill 1
        // "assets.1.layers.0.shapes.1.it.1.c.k.0.s": "#ec1818",
        // // C | Hand.Icon.Fill 1
        // "assets.1.layers.0.shapes.1.it.1.c.k.1.s": "#ec1818",
        // // C | Hand.IK.Stroke 1
        // "assets.1.layers.0.shapes.2.it.1.c.k.0.s": "#b90000",
        // // C | Hand.IK.Stroke 1
        // "assets.1.layers.0.shapes.2.it.1.c.k.1.s": "#b90000",
        // // C | Hand.IK Line.Stroke 1
        // "assets.1.layers.0.shapes.3.it.1.c.k.0.s": "#b90000",
        // // C | Hand.IK Line.Stroke 1
        // "assets.1.layers.0.shapes.3.it.1.c.k.1.s": "#b90000",
        // // S | Arm tip 2.Structure Element.Target.Stroke 1
        // "assets.1.layers.1.shapes.0.it.0.it.2.c.k": "#1a1a1a",
        // // S | Arm tip 2.Structure Element.Display.Link.Fill 1
        // "assets.1.layers.1.shapes.0.it.1.it.0.it.1.c.k": "#ec1818",
        // // S | Hand 2.Structure Element.Target.Stroke 1
        // "assets.1.layers.2.shapes.0.it.0.it.2.c.k": "#1a1a1a",
        // // S | Hand 2.Structure Element.Display.Link.Fill 1
        // "assets.1.layers.2.shapes.0.it.1.it.0.it.1.c.k": "#18ec18",
        // // S | Forearm 2.Structure Element.Target.Stroke 1
        // "assets.1.layers.3.shapes.0.it.0.it.2.c.k": "#1a1a1a",
        // // S | Forearm 2.Structure Element.Display.Link.Fill 1
        // "assets.1.layers.3.shapes.0.it.1.it.0.it.1.c.k": "#ecd618",
        // // S | Arm 2.Structure Element.Target.Stroke 1
        // "assets.1.layers.4.shapes.0.it.0.it.2.c.k": "#1a1a1a",
        // // S | Arm 2.Structure Element.Display.Link.Fill 1
        // "assets.1.layers.4.shapes.0.it.1.it.0.it.1.c.k": "#ec7818",
        // // C | Front Hand.Anchor.Stroke 1
        // "assets.1.layers.5.shapes.0.it.3.c.k.0.s": "#000000",
        // // C | Front Hand.Anchor.Stroke 1
        // "assets.1.layers.5.shapes.0.it.3.c.k.1.s": "#000000",
        // // C | Front Hand.Icon.Fill 1
        // "assets.1.layers.5.shapes.1.it.1.c.k.0.s": "#ec1818",
        // // C | Front Hand.Icon.Fill 1
        // "assets.1.layers.5.shapes.1.it.1.c.k.1.s": "#ec1818",
        // // C | Front Hand.IK.Stroke 1
        // "assets.1.layers.5.shapes.2.it.1.c.k.0.s": "#b90000",
        // // C | Front Hand.IK.Stroke 1
        // "assets.1.layers.5.shapes.2.it.1.c.k.1.s": "#b90000",
        // // C | Front Hand.IK Line.Stroke 1
        // "assets.1.layers.5.shapes.3.it.1.c.k.0.s": "#b90000",
        // // C | Front Hand.IK Line.Stroke 1
        // "assets.1.layers.5.shapes.3.it.1.c.k.1.s": "#b90000",
        // // S | Arm tip.Structure Element.Target.Stroke 1
        // "assets.1.layers.6.shapes.0.it.0.it.2.c.k": "#1a1a1a",
        // // S | Arm tip.Structure Element.Display.Link.Fill 1
        // "assets.1.layers.6.shapes.0.it.1.it.0.it.1.c.k": "#ec1818",
        // // S | Hand.Structure Element.Target.Stroke 1
        // "assets.1.layers.7.shapes.0.it.0.it.2.c.k": "#1a1a1a",
        // // S | Hand.Structure Element.Display.Link.Fill 1
        // "assets.1.layers.7.shapes.0.it.1.it.0.it.1.c.k": "#18ec18",
        // // S | Forearm.Structure Element.Target.Stroke 1
        // "assets.1.layers.8.shapes.0.it.0.it.2.c.k": "#1a1a1a",
        // // S | Forearm.Structure Element.Display.Link.Fill 1
        // "assets.1.layers.8.shapes.0.it.1.it.0.it.1.c.k": "#ecd618",
        // // S | Arm.Structure Element.Target.Stroke 1
        // "assets.1.layers.9.shapes.0.it.0.it.2.c.k": "#1a1a1a",
        // // S | Arm.Structure Element.Display.Link.Fill 1
        // "assets.1.layers.9.shapes.0.it.1.it.0.it.1.c.k": "#ec7818",
        // // Front Hair.Group 2.Group 2.Fill 1
        // "assets.1.layers.10.shapes.0.it.0.it.1.c.k": "#ce5137",
        // // Front Hair.Group 3.Group 3.Fill 1
        // "assets.1.layers.10.shapes.1.it.0.it.1.c.k": "#ce5137",
        // // Eye.Group 5.Stroke 1
        // "assets.1.layers.11.shapes.0.it.1.c.k": "#1b172c",
        // // Eye.Group 5.Stroke 1
        // "assets.1.layers.12.shapes.0.it.1.c.k": "#1b172c",
        // // Smile.Group 6.Fill 1
        // "assets.1.layers.13.shapes.0.it.1.c.k": "#ffffff",
        // // Eyebrow.Group 7.Fill 1
        // "assets.1.layers.14.shapes.0.it.1.c.k": "#832311",
        // // Eyebrow.Group 8.Fill 1
        // "assets.1.layers.15.shapes.0.it.1.c.k": "#832311",
        // // Nose.Group 9.Stroke 1
        // "assets.1.layers.16.shapes.0.it.1.c.k": "#1b142e",
        // // Ear.Group 10.Fill 1
        // "assets.1.layers.17.shapes.0.it.1.c.k": "#ffc1b2",
        // // Head.Group 11.Fill 1
        // "assets.1.layers.18.shapes.0.it.1.c.k": "#ffc1b2",
        // // Neck.Group 112.Group 12.Fill 1
        // "assets.1.layers.19.shapes.0.it.0.it.1.c.k": "#0b181b",
        // // Neck.Group 113.Group 13.Fill 1
        // "assets.1.layers.19.shapes.1.it.0.it.1.c.k": "#ffc1b2",
        // // Ear.Group 14.Fill 1
        // "assets.1.layers.20.shapes.0.it.1.c.k": "#f1998a",
        // // Back Hair.Group 115.Group 15.Fill 1
        // "assets.1.layers.21.shapes.0.it.0.it.1.c.k": "#ce5137",
        // // Back Hair.Group 116.Group 16.Fill 1
        // "assets.1.layers.21.shapes.1.it.0.it.1.c.k": "#ce5137",
        // // Thumb.Group 17.Fill 1
        // "assets.1.layers.22.shapes.0.it.1.c.k": "#ffc1b2",
        // // Hand.Group 18.Fill 1
        // "assets.1.layers.23.shapes.0.it.1.c.k": "#ffc1b2",
        // // Forearm.Group 19.Fill 1
        // "assets.1.layers.24.shapes.0.it.1.c.k": "#ffc1b2",
        // // Arm.Group 220.Group 20.Stroke 1
        // "assets.1.layers.25.shapes.0.it.0.it.1.c.k": "#e2e2e2",
        // // Arm.Group 221.Group 21.Fill 1
        // "assets.1.layers.25.shapes.1.it.0.it.1.c.k": "#ffffff",
        // // Arm.Group 222.Group 22.Fill 1
        // "assets.1.layers.25.shapes.2.it.0.it.1.c.k": "#ffc1b2",
        // // Detail_Arm.Group 23.Stroke 1
        // "assets.1.layers.26.shapes.0.it.1.c.k": "#e2e2e2",
        // // Shoes.Group 227.Group 27.Fill 1
        // "assets.1.layers.27.shapes.0.it.0.it.1.c.k": "#ffffff",
        // // Shoes.Group 228.Group 28.Fill 1
        // "assets.1.layers.27.shapes.1.it.0.it.1.c.k": "#ffffff",
        // // Shoes.Group 229.Group 29.Fill 1
        // "assets.1.layers.27.shapes.2.it.0.it.1.c.k": "#ffffff",
        // // Shoes.Group 330.Group 30.Fill 1
        // "assets.1.layers.27.shapes.3.it.0.it.1.c.k": "#ffffff",
        // // Shoes.Group 331.Group 31.Fill 1
        // "assets.1.layers.27.shapes.4.it.0.it.1.c.k": "#000000",
        // // Shoes.Group 334.Group 34.Fill 1
        // "assets.1.layers.28.shapes.0.it.0.it.1.c.k": "#ffffff",
        // // Shoes.Group 335.Group 35.Fill 1
        // "assets.1.layers.28.shapes.1.it.0.it.1.c.k": "#ffffff",
        // // Shoes.Group 336.Group 36.Fill 1
        // "assets.1.layers.28.shapes.2.it.0.it.1.c.k": "#ffffff",
        // // Shoes.Group 337.Group 37.Fill 1
        // "assets.1.layers.28.shapes.3.it.0.it.1.c.k": "#ffffff",
        // // Shoes.Group 338.Group 38.Fill 1
        // "assets.1.layers.28.shapes.4.it.0.it.1.c.k": "#000000",
        // // Leg_Front.Group 225.Group 25.Stroke 1
        // "assets.1.layers.29.shapes.0.it.0.it.1.c.k": "#ff6c63",
        // // Leg_Front.Group 226.Group 26.Fill 1
        // "assets.1.layers.29.shapes.1.it.0.it.1.c.k": "#ff9184",
        // // Leg_Front.Group 332.Group 32.Fill 1
        // "assets.1.layers.29.shapes.2.it.0.it.1.c.k": "#ffc1b2",
        // // Leg_Behind.Group 333.Group 33.Fill 1
        // "assets.1.layers.30.shapes.0.it.0.it.1.c.k": "#ff9184",
        // // Leg_Behind.Group 339.Group 39.Fill 1
        // "assets.1.layers.30.shapes.1.it.0.it.1.c.k": "#ffc1b2",
        // // Chest.Group 1.Group 1.Fill 1
        // "assets.1.layers.31.shapes.0.it.0.it.1.c.k": "#ffc1b2",
        // // Chest.Group 224.Group 24.Fill 1
        // "assets.1.layers.31.shapes.1.it.0.it.1.c.k": "#ffffff",
        // // Thumb.Group 440.Group 40.Fill 1
        // "assets.1.layers.32.shapes.0.it.0.it.1.c.k": "#ffc1b2",
        // // Thumb.Group 441.Group 41.Fill 1
        // "assets.1.layers.32.shapes.1.it.0.it.1.c.k": "#ffc1b2",
        // // Phone.Group 442.Group 42.Fill 1
        // "assets.1.layers.33.shapes.0.it.0.it.1.c.k": "#ffffff",
        // // Phone.Group 443.Group 43.Fill 1
        // "assets.1.layers.33.shapes.1.it.0.it.1.c.k": "#e7e7e7",
        // // Phone.Group 444.Group 44.Fill 1
        // "assets.1.layers.33.shapes.2.it.0.it.1.c.k": "#251641",
        // // Phone.Group 445.Group 45.Fill 1
        // "assets.1.layers.33.shapes.3.it.0.it.1.c.k": "#372c5f",
        // // Hand.Group 446.Group 46.Fill 1
        // "assets.1.layers.34.shapes.0.it.0.it.1.c.k": "#ffc1b2",
        // // Hand.Group 447.Group 47.Fill 1
        // "assets.1.layers.34.shapes.1.it.0.it.1.c.k": "#ffc1b2",
        // // Forearm.Group 48.Fill 1
        // "assets.1.layers.35.shapes.0.it.1.c.k": "#ffc1b2",
        // // Arm.Group 449.Group 49.Fill 1
        // "assets.1.layers.36.shapes.0.it.0.it.1.c.k": "#ffc1b2",
        // // Arm.Group 550.Group 50.Fill 1
        // "assets.1.layers.36.shapes.1.it.0.it.1.c.k": "#ffffff",
        // // Layer 8.Group 1.Stroke 1
        // "layers.1.shapes.0.it.1.c.k": "#ffffff",
        // // Layer 8.Group 2.Fill 1
        // "layers.1.shapes.1.it.1.c.k": "#0086ff",
        // // Layer 8.Group 3.Fill 1
        // "layers.1.shapes.2.it.1.c.k": "#ffffff",
        // // Layer 8.Group 4.Fill 1
        // "layers.1.shapes.3.it.1.c.k": "#ffffff",
        // // Layer 7.Group 1.Stroke 1
        // "layers.2.shapes.0.it.1.c.k": "#ffffff",
        // // Layer 7.Group 2.Fill 1
        // "layers.2.shapes.1.it.1.c.k": "#0086ff",
        // // Layer 7.Group 3.Fill 1
        // "layers.2.shapes.2.it.1.c.k": "#ffffff",
        // // Layer 7.Group 4.Fill 1
        // "layers.2.shapes.3.it.1.c.k": "#ffffff",
        // // Group 3.Group 3.Fill 1
        // "layers.3.shapes.0.it.1.c.k": "#ffffff",
        // // Group 2.Group 2.Fill 1
        // "layers.4.shapes.0.it.1.c.k": "#ffffff",
        // // Group 1.Group 1.Fill 1
        // "layers.5.shapes.0.it.1.c.k": "#ffffff",
        // // Layer 6.Group 4.Fill 1
        // "layers.6.shapes.0.it.1.c.k": "#0086ff",
        // // Layer 6.Group 5.Fill 1
        // "layers.6.shapes.1.it.1.c.k": "#0086ff",
        // // Base.Group 1.Stroke 1
        // "layers.7.shapes.0.it.1.c.k": "#55382e",
        'layers.7.shapes.0.it.1.c.k': '#bfafa7',
        // // Table.Group 1.Fill 1
        // "layers.8.shapes.0.it.1.c.k": "#eaeaea",
        // // Table.Group 2.Fill 1
        // "layers.8.shapes.1.it.1.c.k": "#ffffff",
        // // Table.Group 3.Fill 1
        // "layers.8.shapes.2.it.1.c.k": "#eaeaea",
        // // Table.Group 4.Fill 1
        // "layers.8.shapes.3.it.1.c.k": "#ffffff",
        // // Table.Group 5.Fill 1
        // "layers.8.shapes.4.it.1.c.k": "#ffffff",
      }),
    [],
  );

  return <LottieView ref={ref} autoPlay loop {...props} source={colorizedSource} />;
};

export default forwardRef(CoworkersAnimation);
