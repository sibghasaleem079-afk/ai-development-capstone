# AI Workflow Drill: Round 1 vs Round 2

## Workflow Comparison

This drill compared two approaches to building the same settings-form feature. Round 1 used a deliberately vague prompt and accepted the generated implementation with manual browser review. Round 2 used a precise prompt with requirements, file references, constraints, example behavior, and a verification step that required tests to be written and run.

The biggest difference was the scope and structure of the UI. Round 1 produced a simple settings layout with three areas: Profile, Appearance, and Notifications. Profile contained Name and Email, while Appearance contained Theme and Language. The layout was functional but visually basic. Round 2 produced a more focused and structured Profile form containing Name, Email, and Age, with a cleaner and more polished layout.

The code diff provides concrete evidence of the difference. The branch comparison changed 8 files, with 1,610 insertions and 179 deletions. Round 2 also added a new `src/SettingsForm.test.jsx` file containing 178 lines of automated tests. The CSS changed by 173 lines, supporting the more structured presentation.

## Correctness and Edge Cases

Round 1 was mainly verified manually. Empty required fields showed validation errors, invalid email input was rejected, valid email input was saved, and Reset cleared the entered Name and Email values.

Round 2 made these behaviors more systematic. Its test suite contains 15 tests, and all 15 passed. The tests cover required fields, invalid email formats, surrounding email whitespace, age validation, boundary ages of 13 and 100, preservation of entered values after validation failure, successful submission, keyboard submission, focus movement to the first invalid field, and clearing field errors after editing.

## Accessibility and Review Effort

Round 2 explicitly tested label/input association, keyboard submission, and focus behavior. This makes accessibility-related behavior easier to verify than relying only on visual inspection. Although Round 2 required more upfront planning and implementation effort, the automated verification reduced the need for repeated manual checking and made regressions easier to detect.

During review, an AI-generated label issue was caught and corrected before final verification. This demonstrated why human review is still necessary even when the AI follows a detailed specification.

## Lessons Learned

A vague prompt can produce a functional result, but a precise prompt creates clearer expectations and makes verification easier. For future work, I will define requirements, edge cases, accessibility expectations, and verification steps before asking AI to implement a feature. I will also review the generated result and run tests instead of assuming that generated code is correct.
