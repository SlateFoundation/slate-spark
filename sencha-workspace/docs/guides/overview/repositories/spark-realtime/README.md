# spark-realtime

## Overview
Provides socket.io bridge to the NATS realtime event backend provided by Lapidus.

Spark classroom applications connect to the socket.io server and can emit messages using the {@link SparkClassroom.Socket}
singleton. Additionally, controllers can use the {@link SparkClassroom.SocketDomain api} event domain via their
{@link Ext.app.Controller#config-listen} config to catch messages from the realtime backend and connection status changes.


## Master Repository
[JarvusInnovations/spark-realtime](https://github.com/JarvusInnovations/spark-realtime)