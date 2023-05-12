export interface CsvImportStructureDto {
    firstname: string
    name: string
    password: string
    username: string
    groups: string
}

export interface CsvExportStructureDto extends CsvImportStructureDto {
    lastLogin: Date
}
