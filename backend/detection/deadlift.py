"""
Deadlift Detection - Rule-based angle analysis
Detects: back rounding, hip hinge, lockout, rep counting
"""

import cv2
import math
import numpy as np
from .utils import calculate_angle, get_static_file_url, get_drawing_color

class DeadliftDetection:

    VISIBILITY_THRESHOLD = 0.5
    # Hip hinge angle thresholds
    HINGE_DOWN_THRESHOLD = 100   # hip angle below this = hinge/down position
    LOCKOUT_THRESHOLD    = 160   # hip angle above this = standing/lockout
    # Back angle thresholds (shoulder-hip-knee)
    BACK_ROUND_THRESHOLD = 140   # below this = back rounding detected

    def __init__(self):
        self.current_stage = ""   # "down" or "up"
        self.counter       = 0
        self.results       = []
        self.has_error     = False

    def detect(self, mp_results, image, timestamp) -> None:
        try:
            import mediapipe as mp
            mp_pose = mp.solutions.pose
            lms = mp_results.pose_landmarks.landmark

            def get(name):
                lm = lms[mp_pose.PoseLandmark[name].value]
                return {"x": lm.x, "y": lm.y, "visibility": lm.visibility}

            # Use left side (better for side-on deadlift view)
            ls = get("LEFT_SHOULDER")
            lh = get("LEFT_HIP")
            lk = get("LEFT_KNEE")
            la = get("LEFT_ANKLE")

            if any(p["visibility"] < self.VISIBILITY_THRESHOLD for p in [ls, lh, lk, la]):
                return

            shoulder = [ls["x"], ls["y"]]
            hip      = [lh["x"], lh["y"]]
            knee     = [lk["x"], lk["y"]]
            ankle    = [la["x"], la["y"]]

            # Hip hinge angle (shoulder-hip-knee)
            hip_angle  = calculate_angle(shoulder, hip, knee)
            # Knee angle (hip-knee-ankle)
            knee_angle = calculate_angle(hip, knee, ankle)
            # Back angle (shoulder-hip-ankle) for rounding detection
            back_angle = calculate_angle(shoulder, hip, ankle)

            # Rep counting: down → up
            if hip_angle < self.HINGE_DOWN_THRESHOLD:
                self.current_stage = "down"
            elif hip_angle > self.LOCKOUT_THRESHOLD and self.current_stage == "down":
                self.current_stage = "up"
                self.counter += 1

            # Back rounding check
            back_rounded = back_angle < self.BACK_ROUND_THRESHOLD

            self.has_error = back_rounded

            if back_rounded:
                self.results.append({
                    "stage": "back rounded",
                    "frame": image,
                    "timestamp": timestamp,
                })

            # Draw overlay
            landmark_color, connection_color = get_drawing_color(self.has_error)
            import mediapipe as mp2
            mp_drawing = mp2.solutions.drawing_utils
            mp_drawing.draw_landmarks(
                image,
                mp_results.pose_landmarks,
                mp2.solutions.pose.POSE_CONNECTIONS,
                mp_drawing.DrawingSpec(color=landmark_color, thickness=2, circle_radius=2),
                mp_drawing.DrawingSpec(color=connection_color, thickness=2, circle_radius=1),
            )

            cv2.rectangle(image, (0, 0), (320, 45), (245, 117, 16), -1)
            cv2.putText(image, f"Reps: {self.counter}  Stage: {self.current_stage}",
                        (5, 20), cv2.FONT_HERSHEY_COMPLEX, 0.5, (255,255,255), 1)
            cv2.putText(image, f"Hip:{int(hip_angle)} Back:{int(back_angle)} {'ROUND!' if back_rounded else 'OK'}",
                        (5, 38), cv2.FONT_HERSHEY_COMPLEX, 0.45, (255,255,255), 1)

        except Exception as e:
            print(f"Deadlift detect error: {e}")

    def handle_detected_results(self, video_name: str):
        file_name = video_name.split(".")[0]
        save_folder = get_static_file_url("images")
        for i, err in enumerate(self.results):
            try:
                img_name = f"{file_name}_{i}.jpg"
                cv2.imwrite(f"{save_folder}/{img_name}", err["frame"])
                self.results[i]["frame"] = img_name
            except Exception:
                self.results[i]["frame"] = None
        return self.results, self.counter

    def clear_results(self):
        self.current_stage = ""
        self.counter       = 0
        self.results       = []
        self.has_error     = False
