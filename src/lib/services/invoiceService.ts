import {
  CreateInvoiceDto,
  Invoice,
  InvoiceSearchParams,
} from '@/src/types/invoice';
import { handleApiError } from '@/src/api/errorHandler';
import apiClient from '../axios';
import { ApiResponse } from '@/src/api/apiResponse';
import { ErrorResponse } from '@/src/api/errorResponse';
import { InvoiceFormValues } from '../schemas/invoice';

export const fetchInvoices = async (): Promise<Invoice[] | null> => {
  try {
    const res = await apiClient.get('invoice');

    return res.data;
  } catch (error) {
    return null;
  }
};

export async function getInvoicePdf(
  invoiceId: string
): Promise<ApiResponse<{ url: string; filename: string }> | ErrorResponse> {
  try {
    const res = await apiClient.get<ApiResponse<{ url: string; filename: string }>>(
      `/invoice/${invoiceId}`
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export const fetchInvoiceById = async (
  id: string
): Promise<Invoice | undefined> => {
  try {
    const res = await apiClient.get(`/invoice/${id}`);

    return res.data;
  } catch (error) {
    console.error('Error fetch invoice', error);
    return undefined;
  }
};

export const fetchInvoicesByCustomer = async (
  id: string
): Promise<ApiResponse<Invoice[]> | ErrorResponse> => {
  try {
    const res = await apiClient.get<ApiResponse<Invoice[]>>(`/invoice/by-customer/${id}`);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};


// export const createInvoice = async (
//   data: NewInvoiceFormData,
//   customerId: string
// ): Promise<CreateInvoiceResponse> => {
//   try {
//     const requestData: CreateInvoiceRequest = {
//       issueDate: data.issueDate.toISOString().split('T')[0], 
//       status: 'draft',
//       customerId: customerId,
//       items: data.items.map(item => {
//         const transformedItem: any = {
//           description: item.description,
//           quantity: Number(item.quantity),
//           unit_price: parseFloat(Number(item.unit_price.toString()).toFixed(2)), 
//         };

//         if (item.tax && item.tax > 0) {
//           transformedItem.tax = parseFloat(
//             Number(item.tax.toString()).toFixed(2)
//           );
//         }

//         return transformedItem;
//       }),
//     };

//     const response = await apiClient.post('/invoice', requestData);

//     if (!response.data) {
//       return {
//         success: false,
//         message: 'Failed to create invoice - no data returned',
//       };
//     }

//     return {
//       success: true,
//       message: 'Invoice created successfully.',
//       invoice: response.data,
//     };
//   } catch (error: unknown) {
//     console.error('Error creating invoice:', error);
//     return {
//       success: false,
//       message:
//         error instanceof Error ? error.message : 'Unknown error occurred',
//     };
//   }
// };


export const updateInvoiceServices = async (
  updateInvoice: InvoiceFormValues,
  invoiceId: string,
  customerId: string
): Promise<void> => {
  if (!updateInvoice) throw new Error('Invoice is required');
  if (!invoiceId) throw new Error('Invoice ID is requered');
  if (!customerId) throw new Error('Invoice ID is requered');

  const formattedData = {
    ...updateInvoice,
    customerId: customerId,
  };

  try {
    await apiClient.put(`invoice/${invoiceId}`, formattedData);

    return;
  } catch (error) {
    console.error('Cannot possible updated an invoice.', error);
    return;
  }
};


export async function getAllInvoices(): Promise<ApiResponse<Invoice[]> | ErrorResponse> {
  try {
    const res = await apiClient.get<ApiResponse<Invoice[]>>('/invoice');
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}


export async function getInvoiceById(
  invoiceId: string
): Promise<ApiResponse<Invoice> | ErrorResponse> {
  try {
    const res = await apiClient.get<ApiResponse<Invoice>>(`/invoice/${invoiceId}`);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

// export async function getMetricsInvoice(): Promise<ApiResponse<any> | ErrorResponse> {
//   try {
//     const res = await apiClient.get<ApiResponse<any>>('/invoice/metrics');
//     return res.data;
//   } catch (error) {
//     return handleApiError(error);
//   }
// }

export async function searchInvoices(
  params: InvoiceSearchParams
): Promise<ApiResponse<Invoice[]> | ErrorResponse> {
  try {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.append('q', params.q);
    if (params.query) searchParams.append('query', params.query);
    if (params.startDate) searchParams.append('startDate', params.startDate);
    if (params.endDate) searchParams.append('endDate', params.endDate);
    if (params.customerName) searchParams.append('customerName', params.customerName);
    if (params.invoiceNumber) searchParams.append('invoiceNumber', params.invoiceNumber);
    if (params.status) {
      const statusValue = params.status === 'all' ? undefined : params.status;
      if (statusValue) {
        if (Array.isArray(statusValue)) {
          statusValue.forEach(s => searchParams.append('status', s));
        } else {
          searchParams.append('status', statusValue);
        }
      }
    }
    if (params.minTotal) searchParams.append('minTotal', params.minTotal);
    if (params.maxTotal) searchParams.append('maxTotal', params.maxTotal);
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortDir) searchParams.append('sortDir', params.sortDir);

    const res = await apiClient.get<ApiResponse<Invoice[]>>(
      `/invoice/search?${searchParams.toString()}`
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function createInvoice(
  data: CreateInvoiceDto
): Promise<ApiResponse<Invoice> | ErrorResponse> {
  try {
    const res = await apiClient.post<ApiResponse<Invoice>>('/invoice/create-invoice', data);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function updateInvoice(
  invoiceId: string,
  data: Partial<CreateInvoiceDto>
): Promise<ApiResponse<Invoice> | ErrorResponse> {
  try {
    const res = await apiClient.put<ApiResponse<Invoice>>(`/invoice/${invoiceId}`, data);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function deleteInvoice(
  invoiceId: string
): Promise<ApiResponse<{ message: string }> | ErrorResponse> {
  try {
    const res = await apiClient.delete<ApiResponse<{ message: string }>>(`/invoice/${invoiceId}`);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}
