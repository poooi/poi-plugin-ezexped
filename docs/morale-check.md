# Notes about morale check

Let `m` be initial morale of a ship, `t` be the total expedition time.
As `m >= 50` doesn't have any negative effects, we only consider cases where `m < 50`.

Consider the natural morale recovery and necessary condition of morale requirement:

(keep in mind that an expedition which claims to take `t` mins, actually takes `t-1` mins)

- `m + 3 * floor((t-1)/3) >= 40`
- `==> m >= 40 - 3 * floor((t-1)/3)`

Now that we know `m >= 0`, we can compute the lower bound of `t`, for which
morale upon return is not a concern (as more than enough morale will be recovered during expedition):

- `m >= 0 >= 40 - 3 * floor((t-1)/3)`
- `==> 3 * floor((t-1)/3) >= 40`
- `==> floor((t-1)/3) >= 40/3`

Let `(t-1) = 3k+r (k is integer, r=0,1,2)`

- `==> floor( (3k+r) / 3 ) >= 40/3`
- `==> k >= 40/3`, which has the least solution `k=14`, in this case `t=14*3+1=43`

So in conclusion:

- ignore special expedition 33,34 as they don't have a concept of returning.

- for expeditions that takes `>=43` mins, morale is not a concern.

- for other expeditions, we still need to check `m >= 40 - 3*floor((t-1)/3)`

   as a result, here is the full list of expeditions that might require morale check:

   - Exped #1: `>=28` morale
   - Exped #2: `>=13` morale
   - Exped #3: `>=22` morale
   - Exped #6: `>=1` morale
