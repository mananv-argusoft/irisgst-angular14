// export interface CompanyModel {
    // companyId: number,
    // companyName: string,
    // entityType: string,
    // roleName: string,
    // role: string,
    // parentCompanyId: string,
    // pan?: string,
    // gstin?: string,
    // rootCompanyId: string,
    // childCompanies: Company[],
// }

// export class Company {
//     constructor(
//         public companyId: number,
//         public companyName: string,
//         public entityType: string,
//         public roleName: string,
//         public role: string,
//         public parentCompanyId: string,
//         public rootCompanyId: string,
//         public childCompanies: Company[],
//         public pan?: string,
//         public gstin?: string,
//     ) {}
// }

export class Company {
    companyId: string;
    companyName: string;
    entityType: string;
    roleName: string;
    role: string;
    parentCompanyId: string;
    rootCompanyId: string;
    childCompanies: Company[];
    pan?: string;
    gstin?: string;
}