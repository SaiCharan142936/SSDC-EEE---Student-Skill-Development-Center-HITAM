import { useState, useEffect, useMemo } from "react";
import { Slider } from "@/components/ui/slider";

interface ArduinoSimulationProps {
  moduleIndex: number;
}

/* ── Module 0: Introduction ── */
const IntroSim = () => {
  const [ledOn, setLedOn] = useState(false);
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Get familiar with Arduino UNO – toggle the built-in LED on pin 13.</p>
      <div className="flex items-center gap-6 bg-[#1e1e2e] rounded-sm p-6">
        <div className="border border-[#444] rounded p-4 bg-[#2a2a3a] text-center min-w-[140px]">
          <div className="text-[10px] text-[#888] mb-1">Arduino UNO</div>
          <div className="text-xs font-mono text-[#aaa]">ATmega328P</div>
          <div className="flex justify-center mt-3">
            <div className={`h-4 w-4 rounded-full border-2 transition-all duration-300 ${ledOn ? "bg-green-400 border-green-500 shadow-[0_0_12px_rgba(74,222,128,0.8)]" : "bg-[#333] border-[#555]"}`} />
          </div>
          <div className="text-[9px] text-[#666] mt-1">PIN 13 LED</div>
        </div>
        <div className="flex flex-col gap-2">
          <button onClick={() => setLedOn(true)} className="px-4 py-2 text-xs font-bold rounded-sm bg-green-600 text-white hover:bg-green-700 transition-colors">Start Simulation</button>
          <button onClick={() => setLedOn(false)} className="px-4 py-2 text-xs font-bold rounded-sm bg-red-600 text-white hover:bg-red-700 transition-colors">Stop Simulation</button>
        </div>
        <div className="text-center">
          <div className={`text-sm font-bold ${ledOn ? "text-green-400" : "text-[#666]"}`}>LED: {ledOn ? "ON" : "OFF"}</div>
        </div>
      </div>
      <a href="https://www.tinkercad.com/things/new?type=circuit" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Open in Tinkercad ↗</a>
    </div>
  );
};

/* ── Module 1: Basic Interfacing – LED & Buzzer ── */
const LEDSequenceSim = () => {
  const [running, setRunning] = useState(false);
  const [leds, setLeds] = useState([false, false, false, false]);
  const [buzzer, setBuzzer] = useState(false);

  useEffect(() => {
    if (!running) return;
    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % 5;
      if (step < 4) { setLeds(prev => prev.map((_, i) => i === step)); setBuzzer(false); }
      else { setLeds([false, false, false, false]); setBuzzer(true); }
    }, 600);
    return () => clearInterval(interval);
  }, [running]);

  const handleStop = () => { setRunning(false); setLeds([false, false, false, false]); setBuzzer(false); };

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Arduino UNO – LED Sequence & Buzzer Simulation.</p>
      <div className="bg-[#1e1e2e] rounded-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="border border-[#444] rounded p-3 bg-[#2a2a3a] min-w-[120px] text-center">
            <div className="text-[10px] text-[#888]">Arduino UNO</div>
            <div className="flex gap-2 justify-center mt-2">
              {leds.map((on, i) => (
                <div key={i} className="text-center">
                  <div className={`h-4 w-4 rounded-full border-2 transition-all ${on ? "bg-green-400 border-green-500 shadow-[0_0_12px_rgba(74,222,128,0.8)]" : "bg-[#333] border-[#555]"}`} />
                  <div className="text-[8px] text-[#666] mt-0.5">D{i + 2}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center px-4">
            <div className={`h-6 w-6 rounded-full mx-auto border-2 transition-all ${buzzer ? "bg-red-500 border-red-600 shadow-[0_0_12px_rgba(239,68,68,0.7)]" : "bg-[#333] border-[#555]"}`} />
            <div className="text-[9px] text-[#888] mt-1">Buzzer</div>
            <div className={`text-[10px] font-bold ${buzzer ? "text-red-400" : "text-[#555]"}`}>{buzzer ? "ON" : "OFF"}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setRunning(true)} disabled={running} className="px-4 py-2 text-xs font-bold rounded-sm bg-green-600 text-white hover:bg-green-700 disabled:opacity-40 transition-colors">Start Simulation</button>
          <button onClick={handleStop} disabled={!running} className="px-4 py-2 text-xs font-bold rounded-sm bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 transition-colors">Stop Simulation</button>
        </div>
      </div>
      <a href="https://www.tinkercad.com/things/new?type=circuit" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Open in Tinkercad ↗</a>
    </div>
  );
};

/* ── Module 2: RGB LED Control ── */
const RGBLedSim = () => {
  const [r, setR] = useState(0);
  const [g, setG] = useState(0);
  const [b, setB] = useState(0);
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Control an RGB LED – adjust each color channel independently.</p>
      <div className="bg-[#1e1e2e] rounded-sm p-6 space-y-4">
        <div className="flex items-center gap-6">
          <div className="border border-[#444] rounded p-4 bg-[#2a2a3a] text-center">
            <div className="text-[10px] text-[#888] mb-2">RGB LED</div>
            <div className="h-12 w-12 rounded-full mx-auto border-2 border-[#555] transition-all" style={{ backgroundColor: `rgb(${r}, ${g}, ${b})`, boxShadow: (r + g + b > 30) ? `0 0 20px rgba(${r},${g},${b},0.6)` : 'none' }} />
          </div>
          <div className="flex-1 space-y-3">
            <div><label className="text-[10px] text-red-400 font-medium">Red: {r}</label><Slider value={[r]} onValueChange={v => setR(v[0])} min={0} max={255} step={1} /></div>
            <div><label className="text-[10px] text-green-400 font-medium">Green: {g}</label><Slider value={[g]} onValueChange={v => setG(v[0])} min={0} max={255} step={1} /></div>
            <div><label className="text-[10px] text-blue-400 font-medium">Blue: {b}</label><Slider value={[b]} onValueChange={v => setB(v[0])} min={0} max={255} step={1} /></div>
          </div>
        </div>
        <div className="text-[10px] text-[#888] font-mono">analogWrite(R, {r}); analogWrite(G, {g}); analogWrite(B, {b});</div>
      </div>
      <a href="https://www.tinkercad.com/things/new?type=circuit" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Open in Tinkercad ↗</a>
    </div>
  );
};

/* ── Module 3: Sensor Interfacing (LDR + Soil Moisture) ── */
const SensorSim = () => {
  const [lightIntensity, setLightIntensity] = useState(50);
  const [soilMoisture, setSoilMoisture] = useState(50);
  const ledOn = lightIntensity < 30;
  const pumpOn = soilMoisture < 30;
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">LDR & Soil Moisture sensor simulation.</p>
      <div className="bg-[#1e1e2e] rounded-sm p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div><label className="text-[10px] text-yellow-400 font-medium block mb-1">LDR Light: {lightIntensity}%</label><Slider value={[lightIntensity]} onValueChange={v => setLightIntensity(v[0])} min={0} max={100} step={1} /><div className="flex justify-between text-[9px] text-[#666] mt-1"><span>Dark</span><span>Bright</span></div></div>
            <div><label className="text-[10px] text-blue-400 font-medium block mb-1">Soil Moisture: {soilMoisture}%</label><Slider value={[soilMoisture]} onValueChange={v => setSoilMoisture(v[0])} min={0} max={100} step={1} /><div className="flex justify-between text-[9px] text-[#666] mt-1"><span>Dry</span><span>Wet</span></div></div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 border border-[#444] rounded-sm">
              <div className={`h-5 w-5 rounded-full border-2 transition-all ${ledOn ? "bg-yellow-400 border-yellow-500 shadow-[0_0_10px_rgba(250,204,21,0.6)]" : "bg-[#333] border-[#555]"}`} />
              <div><div className="text-[10px] font-medium text-[#ccc]">LED (Auto Light)</div><div className="text-[9px] text-[#888]">{ledOn ? "ON – Low light" : "OFF"}</div></div>
            </div>
            <div className="flex items-center gap-3 p-3 border border-[#444] rounded-sm">
              <div className={`h-5 w-5 rounded-full border-2 transition-all ${pumpOn ? "bg-blue-400 border-blue-500 shadow-[0_0_10px_rgba(96,165,250,0.6)]" : "bg-[#333] border-[#555]"}`} />
              <div><div className="text-[10px] font-medium text-[#ccc]">Water Pump</div><div className="text-[9px] text-[#888]">{pumpOn ? "ON – Soil dry" : "OFF"}</div></div>
            </div>
          </div>
        </div>
      </div>
      <a href="https://www.tinkercad.com/things/new?type=circuit" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Open in Tinkercad ↗</a>
    </div>
  );
};

/* ── Module 4: Ultrasonic Distance + LCD ── */
const UltrasonicSim = () => {
  const [distance, setDistance] = useState(50);
  const status = distance < 10 ? "DANGER" : distance < 25 ? "WARNING" : "SAFE";
  const statusColor = distance < 10 ? "text-red-400" : distance < 25 ? "text-yellow-400" : "text-green-400";
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Ultrasonic sensor (HC-SR04) with 16×2 LCD display simulation.</p>
      <div className="bg-[#1e1e2e] rounded-sm p-6 space-y-4">
        <div><label className="text-[10px] text-cyan-400 font-medium block mb-1">Object Distance: {distance} cm</label><Slider value={[distance]} onValueChange={v => setDistance(v[0])} min={2} max={200} step={1} /></div>
        <div className="bg-[#1a3a1a] border-2 border-[#2a5a2a] rounded p-3 font-mono text-center">
          <div className="text-green-300 text-sm">Distance: {distance}cm</div>
          <div className={`text-sm ${statusColor}`}>Status: {status}</div>
        </div>
        <div className="flex items-center gap-4">
          <div className={`h-5 w-5 rounded-full border-2 transition-all ${distance < 10 ? "bg-red-500 border-red-600 shadow-[0_0_12px_rgba(239,68,68,0.7)]" : "bg-[#333] border-[#555]"}`} />
          <span className="text-[10px] text-[#888]">Buzzer: {distance < 10 ? "ALERT!" : "Silent"}</span>
        </div>
      </div>
      <a href="https://www.tinkercad.com/things/new?type=circuit" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Open in Tinkercad ↗</a>
    </div>
  );
};

/* ── Module 5: Detection – Smoke + PIR ── */
const DetectionSim = () => {
  const [smokeLevel, setSmokeLevel] = useState(200);
  const [motionDetected, setMotionDetected] = useState(false);
  const smokeAlert = smokeLevel > 400;
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Smoke sensor (MQ-2) and PIR motion detection simulation.</p>
      <div className="bg-[#1e1e2e] rounded-sm p-6 space-y-4">
        <div><label className="text-[10px] text-orange-400 font-medium block mb-1">Smoke Level: {smokeLevel} ppm</label><Slider value={[smokeLevel]} onValueChange={v => setSmokeLevel(v[0])} min={0} max={800} step={10} /></div>
        <button onClick={() => setMotionDetected(!motionDetected)} className={`px-4 py-2 text-xs font-bold rounded-sm transition-colors ${motionDetected ? "bg-yellow-600 text-white" : "bg-[#444] text-[#aaa] hover:bg-[#555]"}`}>{motionDetected ? "Motion Detected!" : "Simulate Motion (PIR)"}</button>
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-3 border rounded-sm ${smokeAlert ? "border-red-600 bg-red-900/20" : "border-[#444]"}`}><div className="text-[10px] font-medium text-[#ccc]">Smoke Alarm</div><div className={`text-xs font-bold ${smokeAlert ? "text-red-400" : "text-green-400"}`}>{smokeAlert ? "⚠ ALERT" : "✓ Normal"}</div></div>
          <div className={`p-3 border rounded-sm ${motionDetected ? "border-yellow-600 bg-yellow-900/20" : "border-[#444]"}`}><div className="text-[10px] font-medium text-[#ccc]">PIR Sensor</div><div className={`text-xs font-bold ${motionDetected ? "text-yellow-400" : "text-[#888]"}`}>{motionDetected ? "Motion!" : "No Motion"}</div></div>
        </div>
      </div>
      <a href="https://www.tinkercad.com/things/new?type=circuit" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Open in Tinkercad ↗</a>
    </div>
  );
};

/* ── Module 6: Relay Control ── */
const RelaySim = () => {
  const [relayOn, setRelayOn] = useState(false);
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Relay module – control a light bulb using Arduino.</p>
      <div className="bg-[#1e1e2e] rounded-sm p-6">
        <div className="flex items-center gap-8">
          <div className="text-center"><div className="border border-[#444] rounded p-3 bg-[#2a2a3a]"><div className="text-[10px] text-[#888]">Arduino</div><div className="text-[9px] text-[#666]">Pin 7</div></div></div>
          <div className="text-[#666]">→</div>
          <div className={`text-center p-3 border rounded transition-all ${relayOn ? "border-blue-500 bg-blue-900/20" : "border-[#444]"}`}><div className="text-[10px] font-medium text-[#ccc]">Relay</div><div className={`text-xs font-bold ${relayOn ? "text-blue-400" : "text-[#666]"}`}>{relayOn ? "CLOSED" : "OPEN"}</div></div>
          <div className="text-[#666]">→</div>
          <div className="text-center"><div className={`h-10 w-10 rounded-full border-2 mx-auto transition-all ${relayOn ? "bg-yellow-300 border-yellow-400 shadow-[0_0_20px_rgba(253,224,71,0.7)]" : "bg-[#333] border-[#555]"}`} /><div className="text-[10px] text-[#888] mt-1">Bulb</div></div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={() => setRelayOn(true)} className="px-4 py-2 text-xs font-bold rounded-sm bg-green-600 text-white hover:bg-green-700 transition-colors">Turn ON</button>
          <button onClick={() => setRelayOn(false)} className="px-4 py-2 text-xs font-bold rounded-sm bg-red-600 text-white hover:bg-red-700 transition-colors">Turn OFF</button>
        </div>
      </div>
      <a href="https://www.tinkercad.com/things/new?type=circuit" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Open in Tinkercad ↗</a>
    </div>
  );
};

/* ── Module 7: Temperature Monitoring ── */
const TempSim = () => {
  const [temp, setTemp] = useState(25);
  const status = temp > 50 ? "HIGH TEMP!" : temp > 35 ? "Warm" : "Normal";
  const statusColor = temp > 50 ? "text-red-400" : temp > 35 ? "text-yellow-400" : "text-green-400";
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Temperature sensor (LM35) with threshold monitoring.</p>
      <div className="bg-[#1e1e2e] rounded-sm p-6 space-y-4">
        <div><label className="text-[10px] text-cyan-400 font-medium block mb-1">Temperature: {temp}°C</label><Slider value={[temp]} onValueChange={v => setTemp(v[0])} min={-10} max={80} step={1} /></div>
        <div className="bg-[#1a3a1a] border-2 border-[#2a5a2a] rounded p-3 font-mono text-center">
          <div className="text-green-300 text-sm">Temp: {temp}°C</div>
          <div className={`text-sm ${statusColor}`}>{status}</div>
        </div>
      </div>
      <a href="https://www.tinkercad.com/things/new?type=circuit" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Open in Tinkercad ↗</a>
    </div>
  );
};

/* ── Module 8: Motor Control ── */
const MotorSim = () => {
  const [speed, setSpeed] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward" | "stop">("stop");
  const isRunning = direction !== "stop" && speed > 0;
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">L293D motor driver – control DC motor speed and direction.</p>
      <div className="bg-[#1e1e2e] rounded-sm p-6 space-y-4">
        <div><label className="text-[10px] text-cyan-400 font-medium block mb-1">Motor Speed (PWM): {speed}</label><Slider value={[speed]} onValueChange={v => setSpeed(v[0])} min={0} max={255} step={1} /></div>
        <div className="flex gap-2">
          <button onClick={() => setDirection("forward")} className={`px-4 py-2 text-xs font-bold rounded-sm transition-colors ${direction === "forward" ? "bg-green-600 text-white" : "bg-[#444] text-[#aaa] hover:bg-[#555]"}`}>Forward</button>
          <button onClick={() => setDirection("backward")} className={`px-4 py-2 text-xs font-bold rounded-sm transition-colors ${direction === "backward" ? "bg-blue-600 text-white" : "bg-[#444] text-[#aaa] hover:bg-[#555]"}`}>Backward</button>
          <button onClick={() => { setDirection("stop"); setSpeed(0); }} className="px-4 py-2 text-xs font-bold rounded-sm bg-red-600 text-white hover:bg-red-700 transition-colors">Stop</button>
        </div>
        <div className="flex items-center gap-4">
          <div className={`text-3xl ${isRunning ? "animate-spin" : ""}`} style={isRunning ? { animationDuration: `${Math.max(0.2, 2 - speed / 128)}s`, animationDirection: direction === "backward" ? "reverse" : "normal" } : {}}>⚙️</div>
          <div><div className="text-[10px] text-[#ccc]">Motor</div><div className={`text-xs font-bold ${isRunning ? "text-green-400" : "text-[#666]"}`}>{isRunning ? `${direction} @ PWM ${speed}` : "Stopped"}</div></div>
        </div>
      </div>
      <a href="https://www.tinkercad.com/things/new?type=circuit" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Open in Tinkercad ↗</a>
    </div>
  );
};

const simComponents = [IntroSim, LEDSequenceSim, RGBLedSim, SensorSim, UltrasonicSim, DetectionSim, RelaySim, TempSim, MotorSim];

const ArduinoSimulation = ({ moduleIndex }: ArduinoSimulationProps) => {
  const Sim = simComponents[moduleIndex] || IntroSim;
  return (
    <div className="mt-4 border-t border-dashed border-border pt-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="h-4 w-1 bg-primary rounded-full" />
        <h4 className="text-sm font-bold text-foreground">Interactive Simulation</h4>
      </div>
      <Sim />
    </div>
  );
};

export default ArduinoSimulation;
