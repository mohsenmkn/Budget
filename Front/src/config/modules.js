// src/config/modules.js
const BASE = import.meta.env.VITE_API_BASE_URL || ''

export const modules = {
    project: {
        schema: `${BASE}/api/forms/project/schema`,
        endpoint: `${BASE}/api/projects`,
    },
    company: {
        schema: `${BASE}/api/forms/company/schema`,
        endpoint: `${BASE}/api/companies`,
    },
    user: {
        schema: `${BASE}/api/forms/user/schema`,
        endpoint: `${BASE}/api/users`,
    },
    contract: {
        schema: `${BASE}/api/forms/contract/schema`,
        endpoint: `${BASE}/api/contracts`,
    },
}
