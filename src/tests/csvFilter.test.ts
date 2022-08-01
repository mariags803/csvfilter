import {CsvFilter} from "../csvFilter";
describe('CSV filter',()=>{
    const header = 'Invoice_number,Invoice_date,Gross_amount,Net_amount,IVA,IGIC,Description,CIF,NIF';
    const emptyField = '';

    it('allows for correct lines only',()=>{
		const invoiceLine = createInvoiceLine({});
		const csvFilter = CsvFilter.create([header,invoiceLine]);

		const result = csvFilter.filteredLines;

		expect(result).toEqual([header, invoiceLine]);
    });

    it('allows only the correct lines when the igic is applied', () => {
        const invoiceLine = createInvoiceLine({ivaTax: '', igicTax: '7', netAmount: '930'});
        const csvFilter = CsvFilter.create([header, invoiceLine]);

        const result = csvFilter.filteredLines;

        expect(result).toEqual([header, invoiceLine]);
    });

    it('allows only multiple correct lines', () => {
        const invoiceLine = createInvoiceLine({});
        const invoiceLine2 = createInvoiceLine({invoiceId: '2'});
      
        const csvFilter = CsvFilter.create([header, invoiceLine, invoiceLine2]);
      
        const result = csvFilter.filteredLines;
      
        expect(result).toEqual([header, invoiceLine, invoiceLine2]);
    });

    it('excludes lines with both tax fields populated as they are exclusive', () => {
        const invoiceLine = createInvoiceLine({igicTax: '7'});
        const csvFilter = CsvFilter.create([header, invoiceLine]);

        const result = csvFilter.filteredLines;

        expect(result).toEqual([header]);
    });

    it('excludes lines with both tax fields empty as one is required', () => {
        const invoiceLine = createInvoiceLine({ivaTax: ''});
        const csvFilter = CsvFilter.create([header, invoiceLine]);

        const result = csvFilter.filteredLines;

        expect(result).toEqual([header]);
    });

    it('excludes lines with non decimal tax fields', () => {
        const invoiceLine = createInvoiceLine({ivaTax: 'abc'});
        const csvFilter = CsvFilter.create([header, invoiceLine]);

        const result = csvFilter.filteredLines;

        expect(result).toEqual([header]);
    });

    it('excludes lines with both tax fields populated even if non decimal', () => {
        const invoiceLine = createInvoiceLine({ivaTax: 'abc', igicTax: '7'});
        const csvFilter = CsvFilter.create([header, invoiceLine]);

        const result = csvFilter.filteredLines;

        expect(result).toEqual([header]);
    });

    it('excludes lines with miscalculated net amount for iva tax', () => {
        const invoiceLine = createInvoiceLine({netAmount: '900'});
        const csvFilter = CsvFilter.create([header, invoiceLine]);

        const result = csvFilter.filteredLines;

        expect(result).toEqual([header]);
    });

    it('excludes lines with miscalculated net amount for igic tax', () => {
        const invoiceLine = createInvoiceLine({ivaTax: '', igicTax: '7', netAmount: '900'});
        const csvFilter = CsvFilter.create([header, invoiceLine]);

        const result = csvFilter.filteredLines;

        expect(result).toEqual([header]);
    });

    it('excludes lines with cif and nif fields populated as they are exclusive', () => {
        const invoiceLine = createInvoiceLine({ nif: '48628908P'});
        const csvFilter = CsvFilter.create([header, invoiceLine]);
      
        const result = csvFilter.filteredLines;
      
        expect(result).toEqual([header]);
    });

    it('excludes lines with repeated invoice id', () => {
        const invoiceLine = createInvoiceLine({ invoiceId: '1' });
        const invoiceLine2 = createInvoiceLine({ invoiceId: '1' });
        const invoiceLine3 = createInvoiceLine({ invoiceId: '3' });
        const invoiceLine4 = createInvoiceLine({ invoiceId: '4' });
        const invoiceLine5 = createInvoiceLine({ invoiceId: '3' });
        const csvFilter = CsvFilter.create([header, invoiceLine, invoiceLine2, invoiceLine3, invoiceLine4, invoiceLine5]);
          
        const result = csvFilter.filteredLines;
      
        expect(result).toEqual([header, invoiceLine4]);
    });

    it('an empty list will produce an output empty list', () => {
        const csvFilter = CsvFilter.create([]);
        const result = csvFilter.filteredLines;
        expect(result).toEqual([]);
    });

    it('does not allow a list of invoices with a single line', () => {
        const invoiceLine = createInvoiceLine({});
        const result = () => CsvFilter.create([invoiceLine]);
        expect(result).toThrow();
    });

    interface InvoiceLineParams {
        invoiceId?: string;
        ivaTax?: string;
        igicTax?: string;
        netAmount?: string;
        nif?: string;
      }

    function createInvoiceLine({
        invoiceId = '1',
        ivaTax = '21', 
        igicTax = emptyField, 
        netAmount = '790', 
        nif = emptyField
    }: InvoiceLineParams) {
        const invoiceDate = '16/06/2022';
        const grossAmount = '1000';
        const concept = 'Asus Laptop';
        const cif = 'B05539192';
        return [invoiceId, invoiceDate, grossAmount, netAmount, ivaTax, igicTax, concept, cif, nif].join(',');
      }
});