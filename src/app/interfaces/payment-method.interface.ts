export interface PaymentMethodResponse {
  paymentMethods: PaymentMethod[];
}

export interface PaymentMethod {
  id_payment_method:   number;
  payment_method_name: string;
}
