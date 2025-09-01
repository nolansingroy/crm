import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: "addiscare-9ac53",
      clientEmail: "firebase-adminsdk-u99w4@addiscare-9ac53.iam.gserviceaccount.com",
      privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCZ8XkBjuJk9O2J\nMOCp4NCIozP2UoS5ftD73b4CRxAUdd3gd93S15nJZtPl5jsxVKeCZZaKcga1luOA\n07eSpo6BXs/ia48HHmMgX/+0oWXqYjoj7j6Zc8et22Q6GyDsZsGezcymTlqmxuF/\nsfQ0vNQCh90NIVgmDFTP9Srbb1+CrP3olOKJSo0nDnjCy7BlUSe2CsrtvGwxF/hg\nKB///RhbgGYKIvCeilCnY1iiHfekHjU3hkDV2+V3NzvNLUTpFEwBxkQIfsEysZqd\nikw6rsOWO4WmlSqpQxtN7ZRCAcpLCA/s3Y+zSGWWsPe3eL7JLGShs/XagdnJ8cwI\nQoxLAFeXAgMBAAECggEABE29ZHSXp1s3kXh1129LCn7cMtyKDFuGFnx+VYxMtUhk\nRw8NewRUWXk6nviURWPzTjsZKHlZRFYEZIjGtDQG04ll22kcCwa887NAr/k7zap9\nq0fQ+ojuQfyFAqDZMfK0zVk93updhhW/nnUdpCR2nYl/KGD7GLk13R3NWxbJKfCG\nsXEKJ+COvWc7VJnXUa4e7dwHo/Z4SJbP0G4+VPjzlSOSGNxn/TBjqKCDkPshJVAi\nbJJYeyXfmLOvOT8bmEZs/+6HJ3MXJSyr73qjEknEfCJ222Sjar0S6EeIsi1RV+gI\nWT4toPZmTNzl8fG5XAl/dS9LV3MSj2cyZU79SFOeUQKBgQDSqps5khrkCnbyQG/P\n1u26/yR8zQzkrZIrJsVBJfY/UuOMZC1bZ6RJdCdts8USGgfNt4OHAAq3xzLieVX3\n0Ce2etAva36lVvpgB5rSLZAn4/7Hp5j90r7RAHezFFg3SvjC77kOrEtmE/DCCthE\nHBydKow4mq4Uaf9lfQW9dgHdZwKBgQC7Eguxu7n+3KX0T2G7yD44HFKXn8wFrW1L\nGyaisWuU/4JW2geg3kKGNUhThCDxNultG1jzzH/HEnX0vCVuBN7mMR6Wv0rHW3k4\n12L51ylaJ8zG3X+LH4ZFyDGsfukleIsnpMkwLTL9DVqWG1XksOaVjtmbGVhMj/n5\nTR9WIpQmUQKBgFENgQGKfDwm5pLYRezCdd8PkXtO7VoCig1+MkCZmX/NpWz7khPr\n8WKthQoJM5Z+W2hD5iAH3RfOVX6bTn81IEJuSDEme6ijqVtPMbsR+rfOWdV5Xzyx\nW+dP9b354uMLPmDKGPpTQgM5QtV1lLXH1x6FI0QYB0glbDUhABdgEuGbAoGAaj0m\nXQqy55WhveyzIXToOO+EzE1ZDcRfNG838t91rImrGO37tRVkjFmIOL3qA3Ne/7Kv\nQs3Zp1HJoXKUgzXK7MnqiEwdCLjfUDOqJx9Vgbjmp+20+Gqv08OMylzMxZX+2UXR\naEXTFjlWP7dIgXchjMAyvs2XAuwlV7q/2CgNIPECgYEAv79BUV/zyUgPw8uKFnlp\n1kFaAdxcLx5bht/uIiFLquUI5tD7rO/cp+xV2e+1Qd24MgWczN0OuPN0VSuE4RLF\nNeEmbhbYTE4BXf4ZQE0YKC+RM9ZvmI9G+kBYbQsM0AcoIHPrNyGIoOznJ6QSdint\nNVBem+FghOUTlmwulNNylXI=\n-----END PRIVATE KEY-----\n"
    })
  })
}

export const db = getFirestore()
