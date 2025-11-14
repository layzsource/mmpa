let midiAccess = null;
let ccCallbacks = [];
let noteCallbacks = []; // Phase 11.7.23: Note on/off callbacks
let pitchBendCallbacks = []; // Phase 11.7.23: Pitch bend callbacks
let isInitialized = false;

export function initMIDI(callback) {
  if (isInitialized) {
    callback();
    return;
  }

  if (!navigator.requestMIDIAccess) {
    console.warn('🎹 Web MIDI API not supported - MIDI functionality disabled');
    isInitialized = true;
    callback();
    return;
  }

  navigator.requestMIDIAccess()
    .then(access => {
      midiAccess = access;
      setupMIDIDevices();
      isInitialized = true;
      console.log('🎹 MIDI system initialized');
      callback();
    })
    .catch(error => {
      console.warn('🎹 MIDI access denied or failed:', error.message);
      isInitialized = true;
      callback();
    });
}

export function onCC(callback) {
  ccCallbacks.push(callback);
}

// Phase 11.7.23: Register note callbacks
export function onNote(callback) {
  noteCallbacks.push(callback);
}

// Phase 11.7.23: Register pitch bend callbacks
export function onPitchBend(callback) {
  pitchBendCallbacks.push(callback);
}

export function getMIDIDeviceCount() {
  if (!midiAccess) return 0;
  return Array.from(midiAccess.inputs.values()).length;
}

function setupMIDIDevices() {
  if (!midiAccess) return;

  const inputs = Array.from(midiAccess.inputs.values());

  if (inputs.length === 0) {
    console.log('🎹 No MIDI input devices found');
    return;
  }

  console.log(`🎹 Found ${inputs.length} MIDI input device(s):`);

  inputs.forEach(input => {
    console.log(`  - ${input.name}`);
    input.onmidimessage = handleMIDIMessage;
  });

  midiAccess.onstatechange = handleDeviceStateChange;
}

function handleMIDIMessage(event) {
  const [status, data1, data2] = event.data;
  const device = event.target.name || 'Unknown Device';
  const messageType = status & 0xF0;

  // CC messages (0xB0)
  if (messageType === 0xB0) {
    ccCallbacks.forEach(callback => {
      try {
        callback({ cc: data1, value: data2, device });
      } catch (error) {
        console.error('🎹 Error in CC callback:', error);
      }
    });
  }

  // Phase 11.7.23: Note On (0x90) and Note Off (0x80)
  else if (messageType === 0x90 || messageType === 0x80) {
    const noteOn = messageType === 0x90 && data2 > 0;
    const note = data1;
    const velocity = data2;

    noteCallbacks.forEach(callback => {
      try {
        callback({ note, velocity, noteOn, device });
      } catch (error) {
        console.error('🎹 Error in note callback:', error);
      }
    });
  }

  // Phase 11.7.23: Pitch Bend (0xE0)
  else if (messageType === 0xE0) {
    // Pitch bend is 14-bit: combine data1 (LSB) and data2 (MSB)
    const bendValue = (data2 << 7) | data1;
    // Normalize to -1.0 to +1.0 (8192 is center)
    const normalizedBend = (bendValue - 8192) / 8192;

    pitchBendCallbacks.forEach(callback => {
      try {
        callback({ value: normalizedBend, rawValue: bendValue, device });
      } catch (error) {
        console.error('🎹 Error in pitch bend callback:', error);
      }
    });
  }
}

function handleDeviceStateChange(event) {
  const device = event.port;

  if (device.type === 'input') {
    if (device.state === 'connected') {
      console.log(`🎹 MIDI device connected: ${device.name}`);
      device.onmidimessage = handleMIDIMessage;
    } else if (device.state === 'disconnected') {
      console.log(`🎹 MIDI device disconnected: ${device.name}`);
    }
  }
}
