#/usr/env python3

import datetime
import threading

from timing import timing, offset

def getNow():
	now = datetime.datetime.now()
	midnight = now.replace(hour=0, minute=0, second=0, microsecond=0)
	seconds = (now - midnight).seconds

	return seconds

przerwy = []
status = False

def timeStampToSeconds(przerwa):
	hours = przerwa[0]*60*60
	minutes = przerwa[1]*60
	return hours+minutes+offset

for przerwa in timing:
	czasy = []
	for odido in przerwa:
		czasy.append(timeStampToSeconds(odido))
	przerwy.append(czasy)

print(timing)

def isPrzerwa():
	seconds = getNow()
	for przerwa in przerwy:
		if (seconds > przerwa[0]) and (seconds < przerwa[1]):
			return True
	return False

def clock():
	threading.Timer(1.0, clock).start()

	global status
	new = isPrzerwa()
	old = status
	status = new

	if new != old:
		if new:
			print("up")
		else:
			print("down")
	

clock()