export interface FauxDB {
    carriers: Carrier[];
    agencies: Agency[];
}

export interface Agency {
    id:      string;
    details: AgencyDetails;
}

export interface AgencyDetails {
    name:       string;
    agencyCode: string;
    agents:     Agent[];
}

export interface Agent {
    id:      string;
    details: AgentDetails;
}

export interface AgentDetails {
    name:      string;
    customers: Customer[];
}

export interface Customer {
    id:      string;
    details: CustomerDetails;
}

export interface CustomerDetails {
    name:                 string;
    carrierId:            string;
    customer_carrier_id?: string;
    customerCarrierId?:   string;
}

export interface Carrier {
    id:      string;
    details: CarrierDetails;
}

export interface CarrierDetails {
    name: string;
    auth: string;
    url:  string;
}
