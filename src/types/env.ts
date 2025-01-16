const getEnv = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;

    if(value == undefined){
        throw Error("Error in env");
    }

    return value;
};

export const GEMINI_API_KEY = getEnv('GEMINI_API_KEY')