export class CsvFilter {
	private constructor(private readonly lines: string[]) {}

	static create(lines: string[]) {
        if(lines.length === 1) throw new Error('Single line is not allowed');
		return new CsvFilter(lines);
	}

    get filteredLines() {
        if(this.lines.length === 0) return [];
        const header = this.lines[0];
        const invoices = this.lines.slice(1);
        return [header].concat(this.takeNonRepeatedInvoiceIds(this.takeValidInvoices(invoices)));
    }

    private takeNonRepeatedInvoiceIds(invoices: string[]) {
        const invoicesIds = invoices.map((invoice) => this.getInvoiceId(invoice));
        const duplicatedIds =  invoicesIds.filter((id, index) => invoicesIds.indexOf(id) !== index);
        return invoices.filter(invoice => !duplicatedIds.includes(this.getInvoiceId(invoice)))
    }
      
    private validateInvoice = (invoice) => {
        const fields = invoice.split(',');
        const grossAmountField = fields[2];
        const netAmountField = fields[3];
        const ivaField = fields[4];
        const igicField = fields[5];
        const cifField = fields[7];
        const nifField = fields[8];
        const decimalRegex = '\\d+(\\.\\d+)?';
        const areTaxFieldsMutuallyExclusive = (ivaField.match(decimalRegex) || igicField.match(decimalRegex)) && (!ivaField || !igicField);
        const isNetAmountCorrect = (this.hasCorrectAmount(netAmountField, grossAmountField, ivaField) || this.hasCorrectAmount(netAmountField, grossAmountField, igicField));
        const areIdentifierFieldsMutuallyExclusive = !cifField || !nifField;
        return areTaxFieldsMutuallyExclusive && isNetAmountCorrect && areIdentifierFieldsMutuallyExclusive;
    }

    private takeValidInvoices(invoices: string[]) {
        return invoices.filter(this.validateInvoice);
    }

    private hasCorrectAmount(netAmountField: string, grossAmountField: string, taxField: string) {
        const parseNetAmount = parseFloat(netAmountField);
        const parseGrossAmount = parseFloat(grossAmountField);
        const parseIvaTax = parseFloat(taxField);
        return (parseNetAmount === parseGrossAmount - ((parseGrossAmount * parseIvaTax) / 100));
    }

    private getInvoiceId(invoice: string) {
        return invoice.split(',')[0];
    }
}