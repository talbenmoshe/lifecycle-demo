# lifecycle-demo

```
> yarn
> yarn build
> npx concurrently "yarn packages/config-server start" "yarn packages/dashboard-bnm-server start"
```

Then open [http://localhost:3001](http://localhost:3001)

To override staticsUrl add this to the end of the url: `?staticsOverrides=com.placer.dashboard-bnm:1.0.1`

