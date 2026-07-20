# הקמת פאנל הניהול (חד פעמי)

זה מדריך שלב-אחר-שלב, בלי צורך בשום ידע טכני קודם. לוקח כ-10 דקות.

## שלב 1: יצירת טוקן גישה ל-GitHub

1. גשו ל: https://github.com/settings/tokens?type=beta
2. לחצו **Generate new token**
3. תנו שם, למשל `my-m-admin-worker`
4. תחת **Repository access** בחרו **Only select repositories** ובחרו את `dekelpl-dev/my-m` בלבד
5. תחת **Permissions** → **Repository permissions** → מצאו **Contents** ושנו ל-**Read and write**
6. לחצו **Generate token** בתחתית העמוד
7. **העתיקו את הטוקן** (מתחיל ב-`github_pat_...`) — זה יופיע פעם אחת בלבד, שמרו אותו זמנית

## שלב 2: יצירת ה-Worker בקלאודפלייר

1. גשו ל: https://dash.cloudflare.com/sign-up וצרו חשבון חינמי (מייל + סיסמה)
2. בתפריט הצד לחצו **Workers & Pages**
3. לחצו **Create Application** → **Create Worker**
4. תנו שם, למשל `my-m-admin`, ולחצו **Deploy** (זה ייצור worker ריק בינתיים)
5. לחצו **Edit code**
6. מחקו את כל הקוד שיש שם, והדביקו במקומו את כל התוכן של הקובץ `worker.js` שנמצא בתיקייה הזו
7. לחצו **Save and Deploy** (למעלה מימין)

## שלב 3: הגדרת הסודות (Secrets)

1. חזרו לעמוד ה-Worker, לכו ל-**Settings** → **Variables and Secrets**
2. לחצו **Add** ותוסיפו:
   - שם: `GITHUB_TOKEN`, סוג: **Secret**, ערך: הטוקן שהעתקתם בשלב 1
   - שם: `ADMIN_PASSWORD`, סוג: **Secret**, ערך: הסיסמה שקיבלתם ממני (ראו למטה)
3. שמרו

## שלב 4: עדכון כתובת ה-Worker באתר

1. בעמוד ה-Worker, למעלה, תראו כתובת שנראית כך: `https://my-m-admin.XXXXX.workers.dev`
2. העתיקו את הכתובת המדויקת הזו ותשלחו לי אותה — אני אעדכן את קובץ `admin.html` באתר בהתאם ואדחוף.

## שימוש

לאחר ההקמה, גשו לכתובת: `https://dekelpl-dev.github.io/admin.html`
הזינו את הסיסמה, ערכו פרויקטים/סרטונים, ולחצו "שמור שינויים" — זה ידחוף ישירות ל-GitHub ויתעדכן באתר החי תוך דקה-שתיים.

**הסיסמה שלכם:** תישלח בהודעה נפרדת — שמרו אותה במקום בטוח, זו הדרך היחידה להיכנס לפאנל הניהול.
