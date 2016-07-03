export class Config {
    SERVICES_URL: string;
}

export const TNS_CONFIG: Config = {
    SERVICES_URL: global.android ? "10.0.2.2" : "localhost"
};

export const WEB_CONFIG: Config = {
    SERVICES_URL: "localhost"
};
