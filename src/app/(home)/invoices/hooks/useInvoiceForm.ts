import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { CreateInvoiceDto, Invoice } from '@/src/types/invoice';
import { createInvoice, updateInvoice } from '@/src/lib/services/invoiceService';

interface UseInvoiceFormProps {
  initialData?: Invoice | null;
}

export interface CustomerInfoInterface {
  id: string | undefined;
  name: string | null;
}

const generateInvoiceNumber = (): string => {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `INV-${year}${month}-${timestamp}${random}`;
};

export function useInvoiceForm({ initialData }: UseInvoiceFormProps) {
  const router = useRouter();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfoInterface>({
    id: undefined,
    name: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');

  useEffect(() => {
    if (!initialData) {
      const newInvoiceNumber = generateInvoiceNumber();
      setInvoiceNumber(newInvoiceNumber);
    } else {
      setInvoiceNumber(initialData.invoiceNumber);
    }
  }, [initialData]);

  const defaultValues: Partial<CreateInvoiceDto> = {
    customerId: initialData?.customerId || '',
    invoiceNumber: initialData?.invoiceNumber || '',
    invoiceDate:
      initialData?.invoiceDate || new Date().toISOString().split('T')[0],
    dueDate: initialData?.dueDate || '',
    currency: 'USD', // Always USD
    subtotal: initialData?.subtotal || '0.00',
    taxTotal: initialData?.taxTotal || '0.00',
    discountTotal: initialData?.discountTotal || '0.00',
    total: initialData?.total || '0.00',
    memo: initialData?.memo || '',
    account_id: initialData?.account_id || null,
    subaccount_id: initialData?.subaccount_id || null,
    items:
      initialData?.items || [
        {
          lineNo: 1,
          description: '',
          quantity: '1',
          unitPrice: '0.00',
          amount: '0.00',
          department: '',
          taxCode: '',
        },
      ],
  };

  const form = useForm<CreateInvoiceDto>({
    defaultValues,
    mode: 'onChange',
  });

  useEffect(() => {
    if (invoiceNumber && !initialData) {
      form.setValue('invoiceNumber', invoiceNumber);
    }
  }, [invoiceNumber, initialData, form]);

  const rawWatchedItems = useWatch({
    control: form.control,
    name: 'items',
    defaultValue: defaultValues.items || [],
  });

  const watchedItems = useMemo(() => {
    return rawWatchedItems || [];
  }, [rawWatchedItems]);

  const subtotal = useMemo(
    () =>
      watchedItems.reduce((acc, item) => {
        const quantity = parseFloat(item.quantity) || 0;
        const unitPrice = parseFloat(item.unitPrice) || 0;
        return acc + quantity * unitPrice;
      }, 0),
    [watchedItems]
  );

  const taxTotal = useMemo(
    () =>
      watchedItems.reduce((acc, item) => {
        const amount = parseFloat(item.amount) || 0;
        const taxRate = 0.1;
        return acc + amount * taxRate;
      }, 0),
    [watchedItems]
  );

  const totalAmount = useMemo(
    () => {
      const discount = parseFloat(form.watch('discountTotal') || '0');
      return subtotal + taxTotal - discount;
    },
    [subtotal, taxTotal, form]
  );

  useEffect(() => {
    form.setValue('subtotal', subtotal.toFixed(2));
    form.setValue('taxTotal', taxTotal.toFixed(2));
    form.setValue('total', totalAmount.toFixed(2));
  }, [subtotal, taxTotal, totalAmount, form]);

  useEffect(() => {
    watchedItems.forEach((item, index) => {
      const quantity = parseInt(item.quantity) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      const amount = (quantity * unitPrice).toFixed(2);

      if (item.quantity !== quantity.toString()) {
        form.setValue(`items.${index}.quantity`, quantity.toString());
      }

      if (item.amount !== amount) {
        form.setValue(`items.${index}.amount`, amount);
      }
    });
  }, [watchedItems, form]);

  const onSubmit = async (data: CreateInvoiceDto) => {
    if (!customerInfo.id) {
      toast.error('Please select a customer');
      return;
    }

    if (!invoiceNumber) {
      toast.error('Invoice number not generated. Please try again.');
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanedItems = data.items.map(item => ({
        ...item,
        quantity: parseInt(item.quantity).toString(),
        lineNo: item.lineNo,
      }));

      const payload: CreateInvoiceDto = {
        ...data,
        customerId: customerInfo.id,
        invoiceNumber: invoiceNumber,
        currency: 'USD',
        items: cleanedItems,
      };

      const response = await createInvoice(payload);

      if ('statusCode' in response) {
        toast.error(response.message || 'Failed to create invoice');
        return;
      }

      toast.success(`Invoice ${invoiceNumber} created successfully!`);
      router.push('/invoices');
      router.refresh();
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Failed to create invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onUpdate = async (data: CreateInvoiceDto) => {
    if (!initialData?.id) {
      toast.error('Invoice ID not found');
      return;
    }

    if (!customerInfo.id) {
      toast.error('Please select a customer');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Partial<CreateInvoiceDto> = {
        ...data,
        customerId: customerInfo.id,
      };

      const response = await updateInvoice(initialData.id, payload);

      if ('statusCode' in response) {
        toast.error(response.message || 'Failed to update invoice');
        return;
      }

      toast.success('Invoice updated successfully!');
      router.push('/invoices');
      router.refresh();
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast.error('Failed to update invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (initialData?.customer) {
      setCustomerInfo({
        id: initialData.customer.id,
        name: initialData.customer.name,
      });
    }
  }, [initialData]);

  return {
    form,
    customerInfo,
    setCustomerInfo,
    watchedItems,
    subtotal,
    taxTotal,
    totalAmount,
    isSubmitting,
    invoiceNumber,
    onSubmit: initialData ? onUpdate : onSubmit,
  };
}
