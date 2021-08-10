import { useState } from "react";
import { getAppConfigFromEnvironment } from "../lib/Config";



export function useConfig() {
    const [config] = useState(getAppConfigFromEnvironment());

    return config
}