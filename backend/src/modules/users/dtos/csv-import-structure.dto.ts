export interface CsvImportStructureDto {
    firstname: string
    name: string
    password: string
    loginName: string
    groups: string
}

export interface CsvExportStructureDto extends CsvImportStructureDto {
    lastLogin: string
}
