const requests = require('./settings/requests.js');

const generateId = () => `id-${Date.now()}`;

class Payment {
  constructor(access_token) {
    this.access_token = 'Bearer ' + access_token;
    this.user_id = null;
    this.payment_id = null;
    this.user_name = null;
    this.value = null;
  }

  async expire_date(time = 30) {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 30);
    const sum_time = time * 60;
    const max_time = new Date(date.getTime() + sum_time - date.getTimezoneOffset() * 60000);
    return max_time.toISOString().slice(0, -1) + '-10:00';
  }

  async create_payment(value, time = 30) {
    try {
      this.expire = await this.expire_date(time);
      this.response = await requests.requests({
        method: 'POST',
        uri: 'https://api.mercadopago.com/v1/payments', 
        headers: {
          Authorization: this.access_token,
          'X-Idempotency-Key': generateId(),
        },
        json: {
          transaction_amount: parseFloat(value),
          description: 'Sasha Bot Oficial',
          payment_method_id: 'pix',
          payer: {
            email: 'bielsiilvax@gmail.com',
            identification: { type: '037.019.233-88', number: '+55 98 98444-6604' },
            address: {},
          },
          date_of_expiration: this.expire,
        },
      });

      this.payment = this.response.res.body;
      if (this.payment.id) {
        this.payment_id = this.payment.id.toString();
        return {
          payment_id: this.payment_id,
          copy: this.payment.point_of_interaction.transaction_data.qr_code,
          qr_code: this.payment.point_of_interaction.transaction_data.qr_code_base64,
        };
      } else {
        console.error('Erro ao obter o ID do pagamento');
        return null;
      }
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      return null;
    }
  }

  async check_payment() {
    this.response = await requests.requests({
      method: 'GET',
      uri: `https://api.mercadopago.com/v1/payments/${this.payment_id}`,
      headers: {
        Authorization: this.access_token
      }
    });
    this.get_pay = JSON.parse(this.response.res.body);
    return { status: this.get_pay.status };
  }
}

module.exports = { Payment };