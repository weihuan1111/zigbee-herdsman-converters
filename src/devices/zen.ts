import * as fz from "../converters/fromZigbee";
import * as tz from "../converters/toZigbee";
import * as exposes from "../lib/exposes";
import * as reporting from "../lib/reporting";
import type {DefinitionWithExtend} from "../lib/types";

const e = exposes.presets;

export const definitions: DefinitionWithExtend[] = [
    {
        zigbeeModel: ["Zen-01"],
        model: "Zen-01-W",
        vendor: "Zen",
        description: "Thermostat",
        fromZigbee: [fz.battery, fz.thermostat, fz.fan],
        toZigbee: [
            tz.thermostat_local_temperature,
            tz.thermostat_local_temperature_calibration,
            tz.thermostat_occupancy,
            tz.thermostat_occupied_heating_setpoint,
            tz.thermostat_occupied_cooling_setpoint,
            tz.thermostat_unoccupied_heating_setpoint,
            tz.thermostat_setpoint_raise_lower,
            tz.thermostat_running_state,
            tz.thermostat_remote_sensing,
            tz.thermostat_control_sequence_of_operation,
            tz.thermostat_system_mode,
            tz.thermostat_weekly_schedule,
            tz.thermostat_clear_weekly_schedule,
            tz.thermostat_relay_status_log,
            tz.thermostat_keypad_lockout,
            tz.fan_mode,
        ],
        ota: true,
        exposes: [
            e
                .climate()
                .withSetpoint("occupied_heating_setpoint", 10, 30, 0.5)
                .withSetpoint("occupied_cooling_setpoint", 10, 31, 0.5)
                .withLocalTemperature()
                .withSystemMode(["off", "auto", "heat", "cool", "emergency_heating"])
                .withRunningState(["idle", "heat", "cool"])
                .withLocalTemperatureCalibration()
                .withFanMode(["auto", "on"]),
            e.battery_voltage(),
        ],
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(3) || device.getEndpoint(1);
            const binds = ["genBasic", "genIdentify", "genPowerCfg", "genTime", "hvacThermostat", "hvacUserInterfaceCfg", "hvacFanCtrl"];
            await reporting.bind(endpoint, coordinatorEndpoint, binds);

            await reporting.thermostatSystemMode(endpoint);
            await reporting.batteryVoltage(endpoint);
            await reporting.thermostatTemperature(endpoint);
            await reporting.thermostatRunningState(endpoint);
            await reporting.thermostatOccupiedHeatingSetpoint(endpoint);
            await reporting.fanMode(endpoint);
        },
    },
];
