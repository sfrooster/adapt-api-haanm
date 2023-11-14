import inputData from "../inputData.json";
import { fauxDb } from "./config/FauxDB";


// Clean the input data first
const carriersToProcess = new Map<string, Set<string>>();

inputData.forEach(entry => {
    if (carriersToProcess.has(entry.carrier)) {
        carriersToProcess.get(entry.carrier)?.add(entry.customerId);
    }
    else if (fauxDb.carriers.some(carrier => carrier.details.standardizedName === entry.carrier)) {
        carriersToProcess.set(entry.carrier, new Set<string>(entry.customerId));
    }
    else {
        console.warn(`skipping inout data carrier ${entry.carrier}: no config for carrier`);
    }
});

// Process carriers
Array.from(carriersToProcess.entries())
    .map(kvPair => {
        const details =
            fauxDb.carriers
                .find(carrier => carrier.details.standardizedName === kvPair[0])!
                    .details!;
        return {
            ...details,
            customerIds: Array.from(kvPair[1].values())
        }
    })
    .forEach(carrierToProcess => {

    });