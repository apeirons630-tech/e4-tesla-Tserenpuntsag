# Tesla урьдчилсан захиалга

Hero хэсгийн **Order now** товч Byl дээр checkout үүсгээд хэрэглэгчийг Byl-ийн хамгаалагдсан төлбөрийн хуудас руу шилжүүлнэ.

Checkout-ийн тохиргоо:

- Byl project ID: `850`
- Product ID: `1649` (Byl dashboard дахь лавлах ID)
- Price lookup key: `model3price`

Byl-ийн checkout API нь `product_id` талбар авдаггүй. Тиймээс сервер бүтээгдэхүүнийг баримт бичигт заасны дагуу lookup key ашиглан илгээнэ:

```json
{
  "items": [
    { "price": "model3price", "quantity": 1 }
  ]
}
```

## API токеныг нууцлалтай тохируулах

Токеныг HTML, browser JavaScript, git repository эсвэл Vercel-ийн public variable-д **хэзээ ч бүү хадгал**.

### 1. Byl дээр токен үүсгэх

1. [Byl удирдлагын буланд](https://byl.mn/dashboard) нэвтэрнэ.
2. **Тохиргоо → API токэн** хэсэгт орно.
3. `production-server` зэрэг танигдах нэр өгч токен үүсгэнэ.
4. Зөвхөн нэг удаа харагдах токеныг шууд хуулж, secret manager эсвэл environment variable-д хадгална.

Токен алдагдсан бол Byl dashboard-аас хүчингүй болгож шинээр үүсгэнэ.

### 2. Vercel дээр тохируулах

Vercel төслийн **Settings → Environment Variables** хэсэгт дараах утгуудыг нэмнэ:

```text
BYL_TOKEN=<Byl-ээс авсан нууц токен>
BYL_PROJECT_ID=850
BYL_PRICE_LOOKUP_KEY=model3price
```

`BYL_TOKEN`-ийг Production, Preview, Development орчин бүрд шаардлагатайгаар сонгоно. Хадгалсны дараа шинэ deployment хийнэ. Environment variable-ийн өөрчлөлт өмнөх deployment-д автоматаар үйлчлэхгүй.

### 3. Локал хөгжүүлэлт

`.env.example`-ийг `.env` болгон хуулж, бодит токеноо зөвхөн `.env` файлд оруулна:

```text
BYL_TOKEN=<Byl-ээс авсан нууц токен>
BYL_PROJECT_ID=850
BYL_PRICE_LOOKUP_KEY=model3price
```

`.env` болон `.env.*` файлууд `.gitignore`-т орсон. Бодит токеныг `.env.example` файлд бүү бич.

## Ажиллах урсгал

1. Browser `POST /api/create-checkout` хүсэлт илгээнэ.
2. Vercel serverless function нууц `BYL_TOKEN`-ийг уншина.
3. Сервер Byl рүү `Authorization: Bearer <token>` header-тай checkout хүсэлт илгээнэ.
4. Byl-ийн хариунд ирсэн `data.url`-ийг browser-т буцаана.
5. Browser хэрэглэгчийг тухайн Byl checkout URL руу шилжүүлнэ.

Токен browser руу хэзээ ч буцахгүй. API холболт [api/create-checkout.js](api/create-checkout.js)-д, товчны ажиллагаа [script.js](script.js)-д байна.
