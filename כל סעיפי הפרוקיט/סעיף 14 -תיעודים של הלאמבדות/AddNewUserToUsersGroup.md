# 👤 Lambda Function: `AddNewUserToUsersGroup`

**Description:**  
Triggered automatically when a new user signs up via Amazon Cognito. This Lambda function adds the user to the `Users` group in the User Pool using the `admin_add_user_to_group` API.

---

## 🔁 Trigger

**Event Source:** Cognito User Pool (PostConfirmation trigger)  
**Invocation Type:** Automatic (serverless)

---

## 📥 Input Parameters (Cognito Event)

| Field         | Type   | Required | Description                           |
|---------------|--------|----------|---------------------------------------|
| `userPoolId`  | string | ✅        | The ID of the Cognito User Pool       |
| `userName`    | string | ✅        | The username of the newly registered user |

**Example Input:**
```json
{
  "userPoolId": "us-east-1_Abc123456",
  "userName": "john.doe"
}
```

---

## 📤 Output

Returns the original event object (unchanged), allowing Cognito to proceed with its flow.

**Example Output:**
```json
{
  "userPoolId": "us-east-1_Abc123456",
  "userName": "john.doe"
}
```

---

## 🧪 Who Does It Call?

- **Amazon Cognito Identity Provider (IDP)** – `admin_add_user_to_group(...)`

---

## 📝 Notes

- Adds new users automatically to the predefined group: `Users`
- Used to manage role-based access control (RBAC) in Cognito
- This function should be registered under **PostConfirmation** trigger of the user pool

