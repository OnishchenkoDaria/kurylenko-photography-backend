const HashPaymentInfo = require('../forming-payment-request/PaymentPost');

//mocking the reciept number creation
jest.mock('./setUniqueNumber', () => ({
  createUniqueNumber: jest.fn().mockReturnValue('mocked_id'),
}));

//mocking crypto modules (createHash, update, diggest)
jest.mock('crypto', () => ({
  createHash: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  digest: jest.fn().mockReturnValue('mocked_hash'),
}));

//security measures
jest.mock('../be-keys', () => ({
  private: 'mocked_private_key',
  public: 'mocked_public_key',
}));

describe('HashPaymentInfo', () => {
  let req, res, status, json;

  beforeEach(() => {
    req = {
      session: { 
        user: true,
        email: 'test@example.com' 
    },
      body: { value: 100 }, //the mocked value of frontend parser
    };
    
    status = jest.fn().mockReturnThis();
    json = jest.fn();
    res = { status, json };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return error if no active session exist', () => {
    req.session.user = false;

    HashPaymentInfo(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ error: 'no active session' });
  })

  test('should execute payment successfully', () => {
    HashPaymentInfo(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: 'eyJwdWJsaWNfa2V5IjoibW9ja2VkX3B1YmxpY19rZXkiLCJ2ZXJzaW9uIjoiMyIsImFjdGlvbiI6InBheSIsImFtb3VudCI6MTAwLCJjdXJyZW5jeSI6IlVBSCIsImRlc2NyaXB0aW9uIjoidGVzdCIsIm9yZGVyX2lkIjoibW9ja2VkX2lkIiwicmVzdWx0X3VybCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTE3My9hY2NvdW50LXBhZ2UiLCJzZXJ2ZXJfdXJsIjoiaHR0cHM6Ly9hbnQtbWF4aW11bS1ibGluZGx5Lm5ncm9rLWZyZWUuYXBwLyJ9',
      signature: 'bW9ja2VkX2hhc2g=',
    });
  })
})
