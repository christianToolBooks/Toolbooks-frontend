import apiClient from "../axios";
import { handleApiError } from "@/src/api/errorHandler";
import { ApiResponse } from "@/src/api/apiResponse";
import { ErrorResponse } from "@/src/api/errorResponse";
import {
  Customer,
  CreateCustomerContactInput,
  UpdateCustomerForm,
  UpdateCustomerResponse,
  PutCustomerAsInactiveOrActive,
  CreateCustomerAddressInput,
} from "@/src/types/customer";
import { CreateIndividualCustomerInputSchemaType } from "@/src/app/(home)/customer/_schema/customerSchema";

export type CreateCustomerResponse = ApiResponse<Customer>;
export type CreateIndividualCustomerResponse =
  ApiResponse<CreateIndividualCustomerInputSchemaType>;
export type CreateCustomerContactResponse =
  ApiResponse<CreateCustomerContactInput>;

export async function fetchCustomers(): Promise<Customer[] | ErrorResponse> {
  try {
    const res = await apiClient.get<ApiResponse<Customer[]>>("customer");
    return res.data.data ?? [];
  } catch (error) {
    return handleApiError(error);
  }
}

export async function createCustomer(
  data: Customer
): Promise<Customer | ErrorResponse> {
  try {
    const res = await apiClient.post<ApiResponse<Customer>>("customer", data);
    return res.data.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function createIndividualCustomer(
  data: CreateIndividualCustomerInputSchemaType
): Promise<CreateIndividualCustomerInputSchemaType | ErrorResponse> {
  try {
    const res = await apiClient.post<
      ApiResponse<CreateIndividualCustomerInputSchemaType>
    >("customer", data);
    return res.data.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function updateCustomer(
  customerId: string,
  data: UpdateCustomerForm
): Promise<ApiResponse<UpdateCustomerResponse> | ErrorResponse> {
  try {
    const cleanedId = customerId.replace(/[^a-f0-9-]/gi, "");
    const res = await apiClient.patch<ApiResponse<UpdateCustomerResponse>>(
      `customer/${cleanedId}`,
      data
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function updateAddressById(
  customerId: string,
  addressId: string,
  data: Partial<CreateCustomerAddressInput>
): Promise<ApiResponse<CreateCustomerAddressInput> | ErrorResponse> {
  try {
    const { id, ...allowedData } = data;
    const res = await apiClient.patch<ApiResponse<CreateCustomerAddressInput>>(
      `customer-address/update/${customerId}/${addressId}`,
      allowedData
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function updateContactById(
  customerId: string,
  customerContactId: string,
  data: Partial<CreateCustomerContactInput>
): Promise<ApiResponse<CreateCustomerContactInput> | ErrorResponse> {
  try {
    const { id, ...allowedData } = data;
    const res = await apiClient.patch<ApiResponse<CreateCustomerContactInput>>(
      `customer-contact/update/${customerId}/${customerContactId}`,
      allowedData
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function createCustomerContact(
  data: CreateCustomerContactInput
): Promise<ApiResponse<CreateCustomerContactInput> | ErrorResponse> {
  try {
    const res = await apiClient.post<ApiResponse<CreateCustomerContactInput>>('customer-contact', data);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}


export async function deleteCustomerContact(
  customerId: string,
  contactId: string
): Promise<ApiResponse<void> | ErrorResponse> {
  try {
    const res = await apiClient.delete<ApiResponse<void>>(`customer-contact/delete/${customerId}/${contactId}`);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}


export async function createCustomerAddress(
  data: CreateCustomerAddressInput
): Promise<ApiResponse<CreateCustomerAddressInput> | ErrorResponse> {
  try {
    const res = await apiClient.post<ApiResponse<CreateCustomerAddressInput>>(
      'customer-address',
      data
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function deleteCustomerAddress(
  customerId: string,
  addressId: string
): Promise<ApiResponse<void> | ErrorResponse> {
  try {
    const res = await apiClient.delete<ApiResponse<void>>(
      `customer-address/delete/${customerId}/${addressId}`
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function putCustomerAsInactive(
  customerId: string,
  data: PutCustomerAsInactiveOrActive
): Promise<ApiResponse<null> | ErrorResponse> {
  try {
    const res = await apiClient.patch<ApiResponse<null>>(
      `customer/${customerId}`,
      data
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function putCustomerAsActive(
  id: string,
  data: PutCustomerAsInactiveOrActive
): Promise<ApiResponse<null> | ErrorResponse> {
  try {
    const res = await apiClient.patch<ApiResponse<null>>(
      `customer/${id}/activate`,
      data
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function createContact(
  data: CreateCustomerContactInput
): Promise<CreateCustomerContactResponse | ErrorResponse> {
  try {
    const res = await apiClient.post<ApiResponse<CreateCustomerContactInput>>(
      "customer-contact",
      data
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getCustomerByName(
  query: string
): Promise<Customer | Customer[] | ErrorResponse> {
  try {
    const res = await apiClient.get<ApiResponse<Customer | Customer[]>>(
      `customer/by-name/${query}`
    );
    return res.data.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getCustomerById(
  id: string
): Promise<Customer | ErrorResponse> {
  try {
    const res = await apiClient.get<ApiResponse<Customer>>(`customer/${id}`);
    return res.data.data;
  } catch (error) {
    return handleApiError(error);
  }
}
