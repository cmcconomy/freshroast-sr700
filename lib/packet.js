"use strict";

// All details pulled from https://github.com/Roastero/freshroastsr700/blob/master/docs/communication_protocol.rst
// See also, https://roastero.readthedocs.io/en/stable/data/SR700%20Reversing/README/
// packets are all 14 bytes long, made up of 9 fields:
// header(2) tempUnit(2) flag(1) state(2) fanSpeed(1) timeRemaining(1) heatSetting(1) temp(2) footer(2)

// define the packet class here
class Packet {
  constructor (init) {
    this.header = Packet.constants.header.DEFAULT;
    this.tempUnit = Packet.constants.tempUnit.FAHRENHEIT;
    this.flag = Packet.constants.flag.SENT_BY_COMPUTER;
    this.state = Packet.constants.state.IDLE;
    this.fanSpeed = Packet.constants.fanSpeed.BLANK;
    this.timeRemaining = Packet.constants.timeRemaining.BLANK;
    this.heatSetting = Packet.constants.heatSetting.BLANK;
    this.temp = Packet.constants.temp.BLANK;
    this.footer = Packet.constants.footer.DEFAULT;

    if(init) {
      this.header = Packet.constants.header.INIT;
      this.state = Packet.constants.state.BLANK;
    }
  }

  toBytes() {
    let packetHex = this.header+this.tempUnit+this.flag+this.state+this.fanSpeed+this.timeRemaining+this.heatSetting+this.temp+this.footer;
    if( packetHex.length != 28 ) {throw "Invalid hex input for packet construction: " + packetHex + " (should be 14 bytes)" }
    return Buffer.from(packetHex, 'hex');
  }

  static fromBytes (byteBuffer) {
    let packet = new Packet();
    let byteAsString = byteBuffer.toString('hex');

    packet.header = byteAsString.substr(0,4).toUpperCase();
    packet.tempUnit = byteAsString.substr(4,4).toUpperCase();
    packet.flag = byteAsString.substr(8,2).toUpperCase();
    packet.state = byteAsString.substr(10,4).toUpperCase();
    packet.fanSpeed = byteAsString.substr(14,2).toUpperCase();
    packet.timeRemaining = byteAsString.substr(16,2).toUpperCase();
    packet.heatSetting = byteAsString.substr(18,2).toUpperCase();
    packet.temp = byteAsString.substr(20,4).toUpperCase();
    packet.footer = byteAsString.substr(24,4).toUpperCase();

    return packet;
  }
}

Packet.constants = {
  header: { INIT:"AA55", DEFAULT:"AAAA" },
  tempUnit: {FAHRENHEIT:"6174"},
  flag: {SENT_BY_COMPUTER:"63", SENT_BY_ROASTER:"00", CURR_MANUAL_ROASTER_SETTING:"A0", NON_FINAL_RECIPE_LINE:"AA", FINAL_RECIPE_LINE:"AF"},
  state: {IDLE:"0201", ROASTING:"0402", COOLING:"0404", SLEEPING:"0801", BLANK:"0000"},
  fanSpeed: {MIN:"01", MAX:"09", BLANK:"00"},
  timeRemaining: {BLANK:"00"},
  heatSetting: {COOL:"00", LOW:"01", MEDIUM:"02", HIGH:"03", BLANK:"00"},
  temp: {BLANK:"0000"},
  footer: {DEFAULT:"AAFA"}
}

module.exports = Packet;
