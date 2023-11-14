export const fauxDb: FauxDb = {
  "carriers": [
    {
      "id": "d6112346-9590-4f0a-b971-a344453ad1db",
      "details": {
        "name": "Mock Indemnity",
        "standardizedName": "MOCK_INDEMNITY",
        "auth": "none",
        "url": "https://scraping-interview.onrender.com/mock_indemnity/~0"
      }
    },
    {
      "id": "cfd74eaf-70e2-4957-aaba-a8a9528f7a01",
      "details": {
        "name": "Placeholder Insurance",
        "standardizedName": "PLACEHOLDER_CARRIER",
        "auth": "none",
        "url": "https://scraping-interview.onrender.com/placeholder_carrier/~0"
      }
    }
  ],
  "agencies": [
    {
      "id": "cd0e340a-bde6-444c-b484-67d1e1818136",
      "details": {
        "name": "Kemmer - Berge",
        "agencyCode": "BQUI1ONR",
        "agents": [
          {
            "id": "IMELPT0V",
            "details": {
              "name": "Abel Konopelski",
              "customers": [
                {
                  "id": "b1744430-7f2e-4466-99a9-60283f4791eb",
                  "details": {
                    "name": "Teresa Goodwin V",
                    "carrierId": "d6112346-9590-4f0a-b971-a344453ad1db",
                    "customerCarrierId": "a0dfjw9a"
                  }
                }
              ]
            }
          }
        ]
      }
    },
    {
        "id": "ffc32d80-b2f5-444e-8655-1c83d2050fb5",
        "details": {
          "name": "Beier, Quitzon and Kirlin",
          "agencyCode": "H62E9ALA",
          "agents": [
            {
              "id": "VUZ4OBWU",
              "details": {
                "name": "Darin Haag",
                "customers": [
                  {
                    "id": "2cc2ba0e-275c-4c21-8a32-eef67f60b57a",
                    "details": {
                      "name": "Sherri Ritchie",
                      "carrierId": "cfd74eaf-70e2-4957-aaba-a8a9528f7a01",
                      "customerCarrierId": "f02dkl4e"
                    }
                  }
                ]
              }
            }
          ]
        }
      }
  ]
}

export interface FauxDb {
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
  customerCarrierId:   string;
}

export interface Carrier {
  id:      string;
  details: CarrierDetails;
}

export interface CarrierDetails {
  name: string;
  standardizedName: string;
  auth: string;
  url:  string;
}