import numpy as np
import soundfile as sf
from scipy.signal import butter, lfilter

samplerate = 44100
duration = 60.0
t = np.linspace(0, duration, int(duration * samplerate), endpoint=False)

def lowpass(data, cutoff=1500, fs=44100, order=6):
    b, a = butter(order, cutoff / (0.5 * fs), btype='low')
    return lfilter(b, a, data)

def add_echo(signal, delay_sec=0.3, decay=0.4):
    delay_samples = int(delay_sec * samplerate)
    echo = np.zeros_like(signal)
    echo[delay_samples:] = signal[:-delay_samples] * decay
    return signal + echo

def reverb(signal, amount=0.3):
    reverb = np.convolve(signal, np.ones(int(0.01 * samplerate))/int(0.01 * samplerate), mode='same')
    return signal * (1 - amount) + reverb * amount

def synth_beat(t, bpm=120):
    beat_freq = bpm / 60
    return 0.3 * (np.sin(2 * np.pi * beat_freq * t) > 0).astype(float)

data = {
    'NTP-1': {'freq': 220, 'x': [0, 2, 4, 6, 8], 'y': [0, 3, 6, 10, 13.5]},
    'NTP-2': {'freq': 330, 'x': [0, 2, 4, 6, 8], 'y': [0, 0.5, 0.8, 1.2, 1.5]},
    'NTP-3': {'freq': 440, 'x': [0, 2, 4, 6, 8], 'y': [0, 0.4, 0.6, 0.7, 1.1]},
    'NTP-4': {'freq': 550, 'x': [0, 2, 4, 6, 8], 'y': [0, 0.3, 0.5, 0.6, 0.8]},
    'NTP-5': {'freq': 660, 'x': [0, 2, 4, 6, 8], 'y': [0, 0.2, 0.4, 0.5, 0.6]},
    'NS':    {'freq': 880, 'x': [0, 10, 20, 30, 40, 50], 'y': [0, 0.2, 0.4, 0.5, 0.6, 0.7]}
}

final = np.zeros_like(t)

for label, d in data.items():
    freq = d['freq']
    time_points = np.linspace(0, duration, len(d['y']))
    amplitude = np.interp(t, time_points, d['y']) / max(d['y'])

    pulse = 0.5 * (1 + np.sin(2 * np.pi * 0.25 * t))
    amp_mod = amplitude * pulse

    signal = amp_mod * np.sin(2 * np.pi * freq * t)

    signal = lowpass(signal)
    signal = add_echo(signal, delay_sec=0.4, decay=0.3)
    signal = reverb(signal, amount=0.25)

    final += signal

# Добавим техно-бит
beat = synth_beat(t, bpm=125)
final += beat

# Нормализация
final /= np.max(np.abs(final))
sf.write("final_mix.wav", final, samplerate)
