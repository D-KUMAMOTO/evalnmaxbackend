# Database

### **社員データテーブル (employees)**

- **テーブル名**: `employees`
- **パーティションキー (PK)**: `employee_id`（社員ID）
- **ソートキー (SK)**: `employee_name`（社員名）
- **属性**:
    - `employee_id`: 社員の一意の識別子
    - `employee_name`: 社員名
    - `email`: 社員のメールアドレス
    - `department_id`: 所属部署のID
    - `role`: ユーザーの役割（例: ユーザー、管理者、アドミン）
    - `hire_date`: 入社日
    - `status`: 現在の状態（在職、退職など）
    - `retirement_date`: 退職日（退職した場合に更新され、退職後もデータは削除せずに保持）
    - `created_at`: レコード作成日時
    - `updated_at`: レコード更新日時

**インデックス設計**:

- **GSI1**:
    - **パーティションキー**: `department`（部署名）
    - **ソートキー**: `employee_id`（社員ID）
    - **目的**: 部署単位で社員情報を取得できるようにする。
- **GSI2**:
    - **パーティションキー**: `role`（役職）
    - **ソートキー**: `employee_id`（社員ID）
    - **目的**: 役職ごとの社員情報を取得できるようにする。
    

### **部署データテーブル (departments)**

- **テーブル名**: `departments`
- **パーティションキー (PK)**: `department_id`（部署ID）
- **属性**:
    - `department_id`: 部署ID（UUIDまたは数値型）
    - `department_name`: 部署名
    - `created_at`: レコード作成日時
    - `updated_at`: レコード更新日時

---

### **評価項目データテーブル (evaluation_items)**

- **テーブル名**: `evaluation_items`
- **パーティションキー (PK)**: `evaluation_item_id`（評価項目ID）
- **ソートキー (SK)**: `evaluation_group`（評価項目のグループ）
- **属性**:
    - `evaluation_item_id`: 評価項目ID
    - `evaluation_name`: 評価項目名（例: 技術スキル、リーダーシップ）
    - `evaluation_group`: 評価項目が属するグループ（技術/人的スキルなど）
    - `weight`: 評価項目の重み
    - `department_id`: 所属部署のID
    - `created_at`: レコード作成日時
    - `updated_at`: レコード更新日時

**インデックス設計**:

- **GSI1**:
    - **パーティションキー**: `evaluation_group`（評価項目のグループ）
    - **ソートキー**: `evaluation_item_id`（評価項目ID）
    - **目的**: 評価項目をグループ単位で取得。

---

### **評価履歴データテーブル (evaluation_history)**

- **テーブル名**: `evaluation_history`
- **パーティションキー (PK)**: `employee_id`（社員ID）
- **ソートキー (SK)**: `evaluation_date`（評価実施日）
- **属性**:
    - `employee_id`: 社員ID
    - `evaluation_date`: 評価実施日
    - `evaluation_item_id`: 評価項目ID
    - `score`: 評価点数
    - `department_id`: 所属部署のID
    - evaluator_id：評価者のID
    - `comments`: 自由記述フィードバック
    - `created_at`: レコード作成日時
    - `updated_at`: レコード更新日時

**インデックス設計**:

- **GSI1**:
    - **パーティションキー**: `evaluation_year`（評価年度）
    - **ソートキー**: `employee_id`（社員ID）
    - **目的**: 特定の年度における評価履歴を部署別に取得できるようにする。

---

### **ありがとうメッセージデータテーブル (thank_you_messages)**

- **テーブル名**: `thank_you_messages`
- **パーティションキー (PK)**: `sender_employee_id`（送信者社員ID）
- **ソートキー (SK)**: `receiver_employee_id`（受信者社員ID）
- **属性**:
    - `message_id`: ありがとうメッセージの一意なID（UUIDなどで生成）
    - `sender_employee_id`: 送信者社員ID
    - `receiver_employee_id`: 受信者社員ID
    - `message_content`: メッセージ内容（ありがとうの内容）
    - `message_date`: メッセージ送信日
    - `status`: メッセージの状態（送信済み、読了など）
    - `created_at`: レコード作成日時
    - `updated_at`: レコード更新日時

**インデックス設計**:

- **GSI1**:
    - **パーティションキー**: `receiver_employee_id`（受信者社員ID）
    - **ソートキー**: `message_date`（メッセージ送信日）
    - **目的**: 受信者ごとのメッセージ履歴を時間順に取得。

---

### **評価結果（360度評価）データテーブル (feedback_results)**

- **テーブル名**: `feedback_results`
- **パーティションキー (PK)**: `receiver_employee_id`（評価対象社員ID）
- **ソートキー (SK)**: `evaluation_item_id`（評価項目ID）
- **属性**:
    - `receiver_employee_id`: 評価対象社員ID
    - `evaluation_item_id`: 評価項目ID
    - `feedback_score`: フィードバック点数
    - `feedback_comments`: フィードバックコメント
    - `feedback_date`: フィードバックの日付
    - `feedback_provider`: フィードバック提供者（上司、同僚、部下など）
    - `department_id`: 評価対象社員の所属部署ID
    - `created_at`: レコード作成日時
    - `updated_at`: レコード更新日時

**インデックス設計**:

- **GSI1**:
    - **パーティションキー**: `evaluation_year`（評価年度）
    - **ソートキー**: `receiver_employee_id`（評価対象社員ID）
    - **目的**: 年度ごとのフィードバック履歴を取得。