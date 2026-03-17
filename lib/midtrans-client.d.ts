declare module "midtrans-client" {
    interface SnapOptions {
        isProduction?: boolean;
        serverKey: string;
        clientKey?: string;
    }

    interface TransactionDetails {
        order_id: string;
        gross_amount: number;
    }

    interface ItemDetail {
        id: string;
        price: number;
        quantity: number;
        name: string;
    }

    interface CustomerDetail {
        first_name?: string;
        last_name?: string;
        email?: string;
        phone?: string;
    }

    interface TransactionParameter {
        transaction_details: TransactionDetails;
        item_details?: ItemDetail[];
        customer_details?: CustomerDetail;
        [key: string]: unknown;
    }

    interface TransactionResponse {
        token: string;
        redirect_url: string;
    }

    interface TransactionNotification {
        order_id: string;
        transaction_status: string;
        fraud_status?: string;
        payment_type?: string;
        gross_amount?: string;
        [key: string]: unknown;
    }

    class Snap {
        constructor(options: SnapOptions);
        createTransaction(parameter: TransactionParameter): Promise<TransactionResponse>;
        transaction: {
            notification(notification: unknown): Promise<TransactionNotification>;
            status(orderId: string): Promise<TransactionNotification>;
            cancel(orderId: string): Promise<TransactionNotification>;
        };
    }

    class CoreApi {
        constructor(options: SnapOptions);
        transaction: {
            notification(notification: unknown): Promise<TransactionNotification>;
            status(orderId: string): Promise<TransactionNotification>;
        };
    }
}
