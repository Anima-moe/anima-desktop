export function tardisMessage(event: string, data?: object) {
  if (event !== 'ping') {
    console.log(`[TARDIS] OUT > ${event}`, data)
  }
  return JSON.stringify({
    channel: event,
    message: {
      data,
      event,
    },
  })
}

export function tardisHandler(message: MessageEvent) {
  try {
    const packet = JSON.parse(message.data)

    if (!packet) {
      return
    }

    console.log(`[TARDIS] ${packet.channel}`, packet.message.data)

    return {
      event: packet.channel,
      data: packet.message.data,
    }
  } catch (e) {
    return {
      event: 'error',
      data: {
        message: `${e}`,
      },
    }
  }
}
