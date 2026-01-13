// src/lib/services/vendorServices.ts
import { ApiResponse } from '@/src/api/apiResponse';
import { handleApiError } from '@/src/api/errorHandler';
import { ErrorResponse } from '@/src/api/errorResponse';
import apiClient from '../axios';

import {
  CreateVendorAddressInput,
  CreateVendorContactInput,
  CreateVendorInput,
  VendorRecord,
} from '@/src/types/vendorsTypes';
import { CreateIndividualVendorInputSchemaType } from '@/src/app/(home)/bill-pay/_schemas/businessVendorSchema';


export type CreateVendorResponse = ApiResponse<CreateVendorInput>;
export type CreateIndividualVendorResponse = ApiResponse<CreateIndividualVendorInputSchemaType>;


export async function createVendor(
  data: CreateVendorInput
): Promise<ApiResponse<CreateVendorInput> | ErrorResponse> {
  try {
    const res = await apiClient.post<ApiResponse<CreateVendorInput>>('vendors', data);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}


export async function createIndividualVendor(
  data: CreateIndividualVendorInputSchemaType
): Promise<ApiResponse<CreateIndividualVendorInputSchemaType> | ErrorResponse> {
  try {
    const res = await apiClient.post<ApiResponse<CreateIndividualVendorInputSchemaType>>(
      'vendors',
      data
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}


export async function getVendors(): Promise<ApiResponse<VendorRecord[]> | ErrorResponse> {
  try {
    const res = await apiClient.get<ApiResponse<VendorRecord[]>>('vendors');
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}


export async function getVendorByName(
  query: string
): Promise<ApiResponse<VendorRecord | VendorRecord[]> | ErrorResponse> {
  try {
    const res = await apiClient.get<ApiResponse<VendorRecord | VendorRecord[]>>(
      'vendors/search-by-name',
      { params: { query } }
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getVendorById(id: string): Promise<ApiResponse<VendorRecord> | ErrorResponse> {
  try {
    const res = await apiClient.get<ApiResponse<VendorRecord>>(`vendors/${id}`);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}


export async function updateVendorById(
  id: string,
  data: Partial<CreateVendorInput>
): Promise<ApiResponse<CreateVendorInput> | ErrorResponse> {
  try {
    const res = await apiClient.patch<ApiResponse<CreateVendorInput>>(`vendors/${id}`, data);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function putVendorAsActive(id:string, data: Partial<CreateVendorInput>): Promise<ApiResponse<CreateVendorInput> | ErrorResponse> {
  try{
    const res = await apiClient.patch<ApiResponse<CreateVendorInput>>(`vendors/${id}/activate`, data);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function putVendorAsInactive(id:string, data: Partial<CreateVendorInput>): Promise<ApiResponse<CreateVendorInput> | ErrorResponse> {
  try{
    const res = await apiClient.delete<ApiResponse<CreateVendorInput>>(`vendors/${id}`);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function updateContactById(
  vendorId: string,
  VendorContactId: string,
  data: Partial<CreateVendorContactInput>
): Promise<ApiResponse<CreateVendorContactInput> | ErrorResponse> {
  try {
    const { id, createdAt, updatedAt, ...allowedData } = data;
    const res = await apiClient.patch<ApiResponse<CreateVendorContactInput>>(
      `vendor-contact/update/${vendorId}/${VendorContactId}`,
      allowedData
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}


export async function updateAddressById(
  vendorId: string,
  addressId: string,
  data: Partial<CreateVendorAddressInput>
): Promise<ApiResponse<CreateVendorAddressInput> | ErrorResponse> {
  try {
    const { id, createdAt, updatedAt, ...allowedData } = data;
    const res = await apiClient.patch<ApiResponse<CreateVendorAddressInput>>(
      `vendor-address/update/${vendorId}/${addressId}`,
      allowedData
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function createVendorContact(
  data: CreateVendorContactInput
): Promise<ApiResponse<CreateVendorContactInput> | ErrorResponse> {
  try {
    const res = await apiClient.post<ApiResponse<CreateVendorContactInput>>('vendor-contact', data);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}


export async function deleteVendorContact(
  vendorId: string,
  contactId: string
): Promise<ApiResponse<void> | ErrorResponse> {
  try {
    const res = await apiClient.delete<ApiResponse<void>>(`vendor-contact/delete/${vendorId}/${contactId}`);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}


export async function createVendorAddress(
  data: CreateVendorAddressInput
): Promise<ApiResponse<CreateVendorAddressInput> | ErrorResponse> {
  try {
    const res = await apiClient.post<ApiResponse<CreateVendorAddressInput>>(
      'vendor-address',
      data
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function deleteVendorAddress(
  vendorId: string,
  addressId: string
): Promise<ApiResponse<void> | ErrorResponse> {
  try {
    const res = await apiClient.delete<ApiResponse<void>>(
      `vendor-address/delete/${vendorId}/${addressId}`
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}
